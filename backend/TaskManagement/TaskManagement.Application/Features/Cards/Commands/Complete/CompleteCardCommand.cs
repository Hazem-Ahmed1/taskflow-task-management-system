using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Domain.Entities;
using TaskManagement.Domain.Enums;
using ActivityEntity = TaskManagement.Domain.Entities.Activity;

namespace TaskManagement.Application.Features.Cards.Commands.Complete;

public record CompleteCardCommand(Guid CardId, Guid UserId, bool IsCompleted, string? CompletionNote) : IRequest;

public class CompleteCardHandler(IApplicationDbContext db) : IRequestHandler<CompleteCardCommand>
{
    public async Task Handle(CompleteCardCommand request, CancellationToken ct)
    {
        var card = await db.Cards.Include(c => c.List).ThenInclude(l => l.Board)
            .FirstOrDefaultAsync(c => c.Id == request.CardId, ct)
            ?? throw new KeyNotFoundException("Card not found.");

        card.IsCompleted = request.IsCompleted;
        card.CompletionNote = request.CompletionNote;
        card.UpdatedAt = DateTime.UtcNow;

        if (request.IsCompleted)
        {
            db.Activities.Add(new ActivityEntity
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                Action = ActivityAction.CardCompleted,
                Description = $"Completed card '{card.Title}'",
                BoardId = card.BoardId,
                BoardTitle = card.List.Board.Title,
                CardId = card.Id,
                CreatedAt = DateTime.UtcNow
            });
        }

        await db.SaveChangesAsync(ct);
    }
}
