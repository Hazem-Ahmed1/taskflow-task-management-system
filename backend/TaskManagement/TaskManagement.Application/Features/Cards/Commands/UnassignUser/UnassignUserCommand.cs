using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;

namespace TaskManagement.Application.Features.Cards.Commands.UnassignUser;

public record UnassignUserCommand(Guid CardId, Guid AssigneeId) : IRequest;

public class UnassignUserHandler(IApplicationDbContext db) : IRequestHandler<UnassignUserCommand>
{
    public async Task Handle(UnassignUserCommand request, CancellationToken ct)
    {
        var assignee = await db.CardAssignees
            .FirstOrDefaultAsync(a => a.CardId == request.CardId && a.UserId == request.AssigneeId, ct);

        if (assignee is not null)
        {
            db.CardAssignees.Remove(assignee);
            await db.SaveChangesAsync(ct);
        }
    }
}
