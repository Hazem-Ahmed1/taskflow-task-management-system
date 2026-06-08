using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs;

namespace TaskManagement.Application.Features.Notifications.Queries.GetByUser;

public record GetNotificationsQuery(Guid UserId) : IRequest<List<NotificationDto>>;

public class GetNotificationsHandler(IApplicationDbContext db) : IRequestHandler<GetNotificationsQuery, List<NotificationDto>>
{
    public async Task<List<NotificationDto>> Handle(GetNotificationsQuery request, CancellationToken ct) =>
        await db.Notifications
            .Where(n => n.UserId == request.UserId)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => n.ToDto())
            .ToListAsync(ct);
}
