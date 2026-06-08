using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;

namespace TaskManagement.Application.Features.Boards.Commands.RemoveMember;

public record RemoveMemberCommand(Guid BoardId, Guid RequesterId, Guid MemberId) : IRequest;

public class RemoveMemberHandler(IApplicationDbContext db) : IRequestHandler<RemoveMemberCommand>
{
    public async Task Handle(RemoveMemberCommand request, CancellationToken ct)
    {
        var board = await db.Boards.Include(b => b.Members).FirstOrDefaultAsync(b => b.Id == request.BoardId, ct)
            ?? throw new KeyNotFoundException("Board not found.");

        if (board.OwnerId != request.RequesterId)
            throw new UnauthorizedAccessException("Only the owner can remove members.");

        if (request.MemberId == board.OwnerId)
            throw new InvalidOperationException("Cannot remove the board owner.");

        var member = board.Members.FirstOrDefault(m => m.UserId == request.MemberId);
        if (member is not null)
        {
            db.BoardMembers.Remove(member);
            board.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);
        }
    }
}
