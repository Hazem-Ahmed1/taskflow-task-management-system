using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs;

namespace TaskManagement.Application.Features.Activity.Queries.GetByBoard;

public record GetBoardActivityQuery(Guid BoardId, int Page = 1, int PageSize = 50) : IRequest<List<ActivityDto>>;

public class GetBoardActivityHandler(IApplicationDbContext db) : IRequestHandler<GetBoardActivityQuery, List<ActivityDto>>
{
    public async Task<List<ActivityDto>> Handle(GetBoardActivityQuery request, CancellationToken ct) =>
        await db.Activities
            .Include(a => a.User)
            .Include(a => a.Board)
            .Where(a => a.BoardId == request.BoardId)
            .OrderByDescending(a => a.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(a => a.ToDto())
            .ToListAsync(ct);
}
