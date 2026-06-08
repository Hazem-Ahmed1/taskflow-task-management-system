using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Domain.Entities;
using TaskManagement.Domain.Enums;
using ActivityEntity = TaskManagement.Domain.Entities.Activity;

namespace TaskManagement.Application.Features.Lists.Commands.Delete;

public record DeleteListCommand(Guid ListId, Guid UserId) : IRequest;

public class DeleteListHandler(IApplicationDbContext db) : IRequestHandler<DeleteListCommand>
{
    public async Task Handle(DeleteListCommand request, CancellationToken ct)
    {
        var list = await db.Lists
            .Include(l => l.Board).ThenInclude(b => b.Members)
            .FirstOrDefaultAsync(l => l.Id == request.ListId, ct)
            ?? throw new KeyNotFoundException("List not found.");

        var isMember = list.Board.OwnerId == request.UserId || list.Board.Members.Any(m => m.UserId == request.UserId);
        if (!isMember) throw new UnauthorizedAccessException("Access denied.");

        db.Activities.Add(new ActivityEntity
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            Action = ActivityAction.ListDeleted,
            Description = $"Deleted list '{list.Title}' from '{list.Board.Title}'",
            BoardId = list.BoardId,
            BoardTitle = list.Board.Title,
            CreatedAt = DateTime.UtcNow
        });

        db.Lists.Remove(list);
        await db.SaveChangesAsync(ct);
    }
}
