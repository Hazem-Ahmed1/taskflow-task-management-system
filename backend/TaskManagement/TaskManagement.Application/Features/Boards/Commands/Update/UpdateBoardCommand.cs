using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;

namespace TaskManagement.Application.Features.Boards.Commands.Update;

public record UpdateBoardCommand(Guid BoardId, Guid UserId, string? Title, string? Description, string? BackgroundColor)
    : IRequest;

public class UpdateBoardHandler(IApplicationDbContext db) : IRequestHandler<UpdateBoardCommand>
{
    public async Task Handle(UpdateBoardCommand request, CancellationToken ct)
    {
        var board = await db.Boards.FirstOrDefaultAsync(b => b.Id == request.BoardId, ct)
            ?? throw new KeyNotFoundException("Board not found.");

        if (board.OwnerId != request.UserId)
            throw new UnauthorizedAccessException("Only the owner can update the board.");

        if (request.Title is not null) board.Title = request.Title;
        if (request.Description is not null) board.Description = request.Description;
        if (request.BackgroundColor is not null) board.BackgroundColor = request.BackgroundColor;
        board.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
    }
}
