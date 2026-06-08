using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;

namespace TaskManagement.Application.Features.Notifications.Commands.MarkAllRead;

public record MarkAllReadCommand(Guid UserId) : IRequest;

public class MarkAllReadHandler(IApplicationDbContext db) : IRequestHandler<MarkAllReadCommand>
{
    public async Task Handle(MarkAllReadCommand request, CancellationToken ct)
    {
        await db.Notifications
            .Where(n => n.UserId == request.UserId && !n.IsRead)
            .ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead, true), ct);
    }
}
