using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Domain.Entities;
using TaskManagement.Domain.Enums;
using ActivityEntity = TaskManagement.Domain.Entities.Activity;

namespace TaskManagement.Application.Features.Cards.Commands.AssignUser;

public record AssignUserCommand(Guid CardId, Guid AssigneeId, Guid RequesterId) : IRequest;

public class AssignUserHandler(IApplicationDbContext db) : IRequestHandler<AssignUserCommand>
{
    public async Task Handle(AssignUserCommand request, CancellationToken ct)
    {
        var card = await db.Cards.Include(c => c.Assignees).Include(c => c.List).ThenInclude(l => l.Board)
            .FirstOrDefaultAsync(c => c.Id == request.CardId, ct)
            ?? throw new KeyNotFoundException("Card not found.");

        if (card.Assignees.Any(a => a.UserId == request.AssigneeId)) return;

        db.CardAssignees.Add(new CardAssignee { CardId = request.CardId, UserId = request.AssigneeId });

        db.Notifications.Add(new Notification
        {
            Id = Guid.NewGuid(),
            UserId = request.AssigneeId,
            Type = NotificationType.CardAssigned,
            Title = "Card Assigned",
            Message = $"You were assigned to card '{card.Title}'",
            RelatedEntityId = request.CardId.ToString(),
            CreatedAt = DateTime.UtcNow
        });

        db.Activities.Add(new ActivityEntity
        {
            Id = Guid.NewGuid(),
            UserId = request.RequesterId,
            Action = ActivityAction.MemberAssigned,
            Description = $"Assigned a member to card '{card.Title}'",
            BoardId = card.BoardId,
            BoardTitle = card.List.Board.Title,
            CardId = card.Id,
            CreatedAt = DateTime.UtcNow
        });

        card.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
    }
}
