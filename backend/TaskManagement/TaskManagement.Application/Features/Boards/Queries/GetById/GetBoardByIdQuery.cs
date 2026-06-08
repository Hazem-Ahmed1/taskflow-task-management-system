using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs;

namespace TaskManagement.Application.Features.Boards.Queries.GetById;

public record GetBoardByIdQuery(Guid BoardId, Guid RequestingUserId) : IRequest<BoardDetailDto>;

public class GetBoardByIdHandler(IApplicationDbContext db) : IRequestHandler<GetBoardByIdQuery, BoardDetailDto>
{
    public async Task<BoardDetailDto> Handle(GetBoardByIdQuery request, CancellationToken ct)
    {
        var board = await db.Boards
            .Include(b => b.Owner)
            .Include(b => b.Members).ThenInclude(m => m.User)
            .Include(b => b.Lists).ThenInclude(l => l.Cards).ThenInclude(c => c.Assignees)
            .Include(b => b.Lists).ThenInclude(l => l.Cards).ThenInclude(c => c.Labels)
            .Include(b => b.Lists).ThenInclude(l => l.Cards).ThenInclude(c => c.Comments)
            .Include(b => b.Lists).ThenInclude(l => l.Cards).ThenInclude(c => c.Attachments)
            .FirstOrDefaultAsync(b => b.Id == request.BoardId, ct)
            ?? throw new KeyNotFoundException($"Board {request.BoardId} not found.");

        var isMember = board.OwnerId == request.RequestingUserId
            || board.Members.Any(m => m.UserId == request.RequestingUserId);
        if (!isMember) throw new UnauthorizedAccessException("Access denied.");

        return board.ToDetailDto();
    }
}
