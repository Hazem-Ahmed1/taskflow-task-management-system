using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;

namespace TaskManagement.Application.Features.Lists.Commands.Update;

public record UpdateListCommand(Guid ListId, Guid UserId, string Title) : IRequest;

public class UpdateListHandler(IApplicationDbContext db) : IRequestHandler<UpdateListCommand>
{
    public async Task Handle(UpdateListCommand request, CancellationToken ct)
    {
        var list = await db.Lists
            .Include(l => l.Board).ThenInclude(b => b.Members)
            .FirstOrDefaultAsync(l => l.Id == request.ListId, ct)
            ?? throw new KeyNotFoundException("List not found.");

        var isMember = list.Board.OwnerId == request.UserId || list.Board.Members.Any(m => m.UserId == request.UserId);
        if (!isMember) throw new UnauthorizedAccessException("Access denied.");

        list.Title = request.Title;
        list.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
    }
}
