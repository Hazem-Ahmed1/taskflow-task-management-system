using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Domain.Enums;

namespace TaskManagement.Application.Features.Cards.Commands.Update;

public record UpdateCardCommand(
    Guid CardId, Guid UserId,
    string? Title, string? Description,
    string? Priority, DateTime? Deadline,
    List<string>? Labels) : IRequest;

public class UpdateCardHandler(IApplicationDbContext db) : IRequestHandler<UpdateCardCommand>
{
    public async Task Handle(UpdateCardCommand request, CancellationToken ct)
    {
        var card = await db.Cards.Include(c => c.Labels)
            .FirstOrDefaultAsync(c => c.Id == request.CardId, ct)
            ?? throw new KeyNotFoundException("Card not found.");

        if (request.Title is not null) card.Title = request.Title;
        if (request.Description is not null) card.Description = request.Description;
        if (request.Priority is not null && Enum.TryParse<Priority>(request.Priority, ignoreCase: true, out var p))
            card.Priority = p;
        if (request.Deadline.HasValue) card.Deadline = request.Deadline;
        if (request.Labels is not null)
        {
            db.CardLabels.RemoveRange(card.Labels);
            foreach (var label in request.Labels)
                card.Labels.Add(new Domain.Entities.CardLabel { CardId = card.Id, Label = label });
        }
        card.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
    }
}
