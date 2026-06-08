using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Domain.Enums;

namespace TaskManagement.Application.Features.Boards.Commands.Delete;

public record DeleteBoardCommand(Guid BoardId, Guid UserId) : IRequest;

public class DeleteBoardHandler(IApplicationDbContext db) : IRequestHandler<DeleteBoardCommand>
{
    public async Task Handle(DeleteBoardCommand request, CancellationToken ct)
    {
        var board = await db.Boards.FirstOrDefaultAsync(b => b.Id == request.BoardId, ct)
            ?? throw new KeyNotFoundException("Board not found.");

        if (board.OwnerId != request.UserId)
            throw new UnauthorizedAccessException("Only the owner can delete the board.");

        db.Activities.Add(new Domain.Entities.Activity
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            Action = ActivityAction.BoardDeleted,
            Description = $"Deleted board '{board.Title}'",
            CreatedAt = DateTime.UtcNow
        });

        db.Boards.Remove(board);
        await db.SaveChangesAsync(ct);
    }
}
