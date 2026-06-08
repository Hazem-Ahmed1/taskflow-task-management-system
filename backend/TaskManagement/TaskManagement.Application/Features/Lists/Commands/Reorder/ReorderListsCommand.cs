using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;

namespace TaskManagement.Application.Features.Lists.Commands.Reorder;

public record ReorderListsCommand(Guid BoardId, Guid UserId, List<Guid> OrderedListIds) : IRequest;

public class ReorderListsHandler(IApplicationDbContext db) : IRequestHandler<ReorderListsCommand>
{
    public async Task Handle(ReorderListsCommand request, CancellationToken ct)
    {
        var board = await db.Boards.Include(b => b.Members).Include(b => b.Lists)
            .FirstOrDefaultAsync(b => b.Id == request.BoardId, ct)
            ?? throw new KeyNotFoundException("Board not found.");

        var isMember = board.OwnerId == request.UserId || board.Members.Any(m => m.UserId == request.UserId);
        if (!isMember) throw new UnauthorizedAccessException("Access denied.");

        for (var i = 0; i < request.OrderedListIds.Count; i++)
        {
            var list = board.Lists.FirstOrDefault(l => l.Id == request.OrderedListIds[i]);
            if (list is not null) { list.Position = i; list.UpdatedAt = DateTime.UtcNow; }
        }

        await db.SaveChangesAsync(ct);
    }
}
