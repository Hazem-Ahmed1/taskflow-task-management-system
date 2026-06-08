using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;

namespace TaskManagement.Application.Features.Boards.Commands.ToggleStar;

public record ToggleStarCommand(Guid BoardId, Guid UserId) : IRequest<bool>;

public class ToggleStarHandler(IApplicationDbContext db) : IRequestHandler<ToggleStarCommand, bool>
{
    public async Task<bool> Handle(ToggleStarCommand request, CancellationToken ct)
    {
        var board = await db.Boards
            .Include(b => b.Members)
            .FirstOrDefaultAsync(b => b.Id == request.BoardId, ct)
            ?? throw new KeyNotFoundException("Board not found.");

        var isMember = board.OwnerId == request.UserId || board.Members.Any(m => m.UserId == request.UserId);
        if (!isMember) throw new UnauthorizedAccessException("Access denied.");

        board.IsStarred = !board.IsStarred;
        board.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        return board.IsStarred;
    }
}
