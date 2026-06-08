using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs;

namespace TaskManagement.Application.Features.Boards.Queries.GetAll;

public record GetBoardsQuery(Guid UserId) : IRequest<List<BoardSummaryDto>>;

public class GetBoardsHandler(IApplicationDbContext db) : IRequestHandler<GetBoardsQuery, List<BoardSummaryDto>>
{
    public async Task<List<BoardSummaryDto>> Handle(GetBoardsQuery request, CancellationToken ct)
    {
        return await db.Boards
            .Include(b => b.Owner)
            .Include(b => b.Members)
            .Include(b => b.Lists).ThenInclude(l => l.Cards)
            .Where(b => b.OwnerId == request.UserId || b.Members.Any(m => m.UserId == request.UserId))
            .Select(b => b.ToSummaryDto())
            .ToListAsync(ct);
    }
}
