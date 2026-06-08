using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs;

namespace TaskManagement.Application.Features.Comments.Queries.GetByCard;

public record GetCommentsQuery(Guid CardId) : IRequest<List<CommentDto>>;

public class GetCommentsHandler(IApplicationDbContext db) : IRequestHandler<GetCommentsQuery, List<CommentDto>>
{
    public async Task<List<CommentDto>> Handle(GetCommentsQuery request, CancellationToken ct) =>
        await db.Comments
            .Include(c => c.User)
            .Where(c => c.CardId == request.CardId)
            .OrderBy(c => c.CreatedAt)
            .Select(c => c.ToDto())
            .ToListAsync(ct);
}
