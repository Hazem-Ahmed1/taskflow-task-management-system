using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Domain.Entities;
using TaskManagement.Domain.Enums;
using ActivityEntity = TaskManagement.Domain.Entities.Activity;

namespace TaskManagement.Application.Features.Cards.Commands.Delete;

public record DeleteCardCommand(Guid CardId, Guid UserId) : IRequest;

public class DeleteCardHandler(IApplicationDbContext db) : IRequestHandler<DeleteCardCommand>
{
    public async Task Handle(DeleteCardCommand request, CancellationToken ct)
    {
        var card = await db.Cards.Include(c => c.List).ThenInclude(l => l.Board)
            .FirstOrDefaultAsync(c => c.Id == request.CardId, ct)
            ?? throw new KeyNotFoundException("Card not found.");

        db.Activities.Add(new ActivityEntity
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            Action = ActivityAction.CardDeleted,
            Description = $"Deleted card '{card.Title}'",
            BoardId = card.BoardId,
            BoardTitle = card.List.Board.Title,
            CreatedAt = DateTime.UtcNow
        });

        db.Cards.Remove(card);
        await db.SaveChangesAsync(ct);
    }
}
