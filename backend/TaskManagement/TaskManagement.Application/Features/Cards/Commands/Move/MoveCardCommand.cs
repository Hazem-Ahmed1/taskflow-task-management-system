using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;

namespace TaskManagement.Application.Features.Cards.Commands.Move;

public record MoveCardCommand(Guid CardId, Guid UserId, Guid TargetListId, int NewPosition) : IRequest;

public class MoveCardHandler(IApplicationDbContext db) : IRequestHandler<MoveCardCommand>
{
    public async Task Handle(MoveCardCommand request, CancellationToken ct)
    {
        var card = await db.Cards.FirstOrDefaultAsync(c => c.Id == request.CardId, ct)
            ?? throw new KeyNotFoundException("Card not found.");

        var targetList = await db.Lists.FindAsync([request.TargetListId], ct)
            ?? throw new KeyNotFoundException("Target list not found.");

        // Shift cards in original list
        var oldListCards = await db.Cards
            .Where(c => c.ListId == card.ListId && c.Id != card.Id)
            .OrderBy(c => c.Position).ToListAsync(ct);
        for (var i = 0; i < oldListCards.Count; i++) oldListCards[i].Position = i;

        // Shift cards in target list
        var newListCards = await db.Cards
            .Where(c => c.ListId == request.TargetListId && c.Id != card.Id)
            .OrderBy(c => c.Position).ToListAsync(ct);
        newListCards.Insert(request.NewPosition, card);
        for (var i = 0; i < newListCards.Count; i++) newListCards[i].Position = i;

        card.ListId = request.TargetListId;
        card.BoardId = targetList.BoardId;
        card.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
    }
}
