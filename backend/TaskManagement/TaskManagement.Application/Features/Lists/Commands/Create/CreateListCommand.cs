using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs;
using TaskManagement.Domain.Entities;
using TaskManagement.Domain.Enums;
using ActivityEntity = TaskManagement.Domain.Entities.Activity;

namespace TaskManagement.Application.Features.Lists.Commands.Create;

public record CreateListCommand(Guid BoardId, Guid UserId, string Title) : IRequest<ListDto>;

public class CreateListHandler(IApplicationDbContext db) : IRequestHandler<CreateListCommand, ListDto>
{
    public async Task<ListDto> Handle(CreateListCommand request, CancellationToken ct)
    {
        var board = await db.Boards.Include(b => b.Members).Include(b => b.Lists)
            .FirstOrDefaultAsync(b => b.Id == request.BoardId, ct)
            ?? throw new KeyNotFoundException("Board not found.");

        var isMember = board.OwnerId == request.UserId || board.Members.Any(m => m.UserId == request.UserId);
        if (!isMember) throw new UnauthorizedAccessException("Access denied.");

        var position = board.Lists.Count;
        var list = new BoardList
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            BoardId = request.BoardId,
            Position = position,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.Lists.Add(list);

        db.Activities.Add(new ActivityEntity
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            Action = ActivityAction.ListCreated,
            Description = $"Added list '{list.Title}' to '{board.Title}'",
            BoardId = request.BoardId,
            BoardTitle = board.Title,
            CreatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync(ct);
        return new ListDto(list.Id, list.Title, list.BoardId, list.Position, [], list.CreatedAt, list.UpdatedAt);
    }
}
