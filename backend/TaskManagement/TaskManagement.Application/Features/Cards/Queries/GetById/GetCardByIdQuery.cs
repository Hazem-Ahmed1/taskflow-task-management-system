using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs;

namespace TaskManagement.Application.Features.Cards.Queries.GetById;

public record GetCardByIdQuery(Guid CardId) : IRequest<CardDetailDto>;

public class GetCardByIdHandler(IApplicationDbContext db) : IRequestHandler<GetCardByIdQuery, CardDetailDto>
{
    public async Task<CardDetailDto> Handle(GetCardByIdQuery request, CancellationToken ct)
    {
        var card = await db.Cards
            .Include(c => c.Assignees).ThenInclude(a => a.User)
            .Include(c => c.Labels)
            .Include(c => c.Comments).ThenInclude(c => c.User)
            .Include(c => c.Attachments)
            .FirstOrDefaultAsync(c => c.Id == request.CardId, ct)
            ?? throw new KeyNotFoundException("Card not found.");

        return new CardDetailDto(
            card.Id, card.Title, card.Description, card.ListId, card.BoardId,
            card.Priority.ToString().ToLowerInvariant(), card.Deadline,
            card.Position, card.IsCompleted, card.CompletionNote,
            card.Assignees.Select(a => a.User.ToDto()).ToList(),
            card.Labels.Select(l => l.Label).ToList(),
            card.Comments.OrderBy(c => c.CreatedAt).Select(c => c.ToDto()).ToList(),
            card.Attachments.Select(a => new AttachmentDto(a.Id, a.CardId, a.FileName, a.FileUrl, a.UploadedBy, a.UploadedAt)).ToList(),
            card.CreatedAt, card.UpdatedAt);
    }
}
