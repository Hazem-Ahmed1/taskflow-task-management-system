using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;

namespace TaskManagement.Application.Features.Notifications.Commands.MarkRead;

public record MarkReadCommand(Guid NotificationId, Guid UserId) : IRequest;

public class MarkReadHandler(IApplicationDbContext db) : IRequestHandler<MarkReadCommand>
{
    public async Task Handle(MarkReadCommand request, CancellationToken ct)
    {
        var notification = await db.Notifications.FirstOrDefaultAsync(
            n => n.Id == request.NotificationId && n.UserId == request.UserId, ct);

        if (notification is not null)
        {
            notification.IsRead = true;
            await db.SaveChangesAsync(ct);
        }
    }
}
