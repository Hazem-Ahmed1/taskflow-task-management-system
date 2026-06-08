using MediatR;
using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs;
using TaskManagement.Domain.Entities;
using ActivityEntity = TaskManagement.Domain.Entities.Activity;

namespace TaskManagement.Application.Features.Boards.Commands.Create;

public record CreateBoardCommand(string Title, string Description, string BackgroundColor, Guid OwnerId)
    : IRequest<BoardSummaryDto>;

public class CreateBoardHandler(IApplicationDbContext db) : IRequestHandler<CreateBoardCommand, BoardSummaryDto>
{
    public async Task<BoardSummaryDto> Handle(CreateBoardCommand request, CancellationToken ct)
    {
        var owner = await db.Users.FindAsync([request.OwnerId], ct)
            ?? throw new KeyNotFoundException("User not found.");

        var board = new Board
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            BackgroundColor = request.BackgroundColor,
            OwnerId = request.OwnerId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        board.Members.Add(new BoardMember { BoardId = board.Id, UserId = request.OwnerId });

        db.Boards.Add(board);

        db.Activities.Add(new ActivityEntity
        {
            Id = Guid.NewGuid(),
            UserId = request.OwnerId,
            Action = Domain.Enums.ActivityAction.BoardCreated,
            Description = $"Created board '{board.Title}'",
            BoardId = board.Id,
            BoardTitle = board.Title,
            CreatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync(ct);

        board.Owner = owner;
        return board.ToSummaryDto();
    }
}
