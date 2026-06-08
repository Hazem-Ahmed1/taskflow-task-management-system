using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs;

namespace TaskManagement.Application.Features.Activity.Queries.GetAll;

public record GetActivityQuery(Guid UserId, int Page = 1, int PageSize = 50) : IRequest<List<ActivityDto>>;

public class GetActivityHandler(IApplicationDbContext db) : IRequestHandler<GetActivityQuery, List<ActivityDto>>
{
    public async Task<List<ActivityDto>> Handle(GetActivityQuery request, CancellationToken ct) =>
        await db.Activities
            .Include(a => a.User)
            .Include(a => a.Board)
            .Where(a => a.UserId == request.UserId)
            .OrderByDescending(a => a.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(a => a.ToDto())
            .ToListAsync(ct);
}
