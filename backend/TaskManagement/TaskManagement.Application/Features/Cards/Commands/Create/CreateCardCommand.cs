using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs;
using TaskManagement.Domain.Entities;
using TaskManagement.Domain.Enums;
using ActivityEntity = TaskManagement.Domain.Entities.Activity;

namespace TaskManagement.Application.Features.Cards.Commands.Create;

public record CreateCardCommand(
    Guid ListId, Guid BoardId, Guid UserId,
    string Title, string Description,
    string Priority, DateTime? Deadline,
    List<string>? Labels) : IRequest<CardDto>;

public class CreateCardHandler(IApplicationDbContext db) : IRequestHandler<CreateCardCommand, CardDto>
{
    public async Task<CardDto> Handle(CreateCardCommand request, CancellationToken ct)
    {
        var list = await db.Lists.Include(l => l.Cards).Include(l => l.Board)
            .FirstOrDefaultAsync(l => l.Id == request.ListId, ct)
            ?? throw new KeyNotFoundException("List not found.");

        var priority = Enum.TryParse<Priority>(request.Priority, ignoreCase: true, out var p) ? p : Priority.Medium;

        var card = new Card
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            ListId = request.ListId,
            BoardId = request.BoardId,
            Priority = priority,
            Deadline = request.Deadline,
            Position = list.Cards.Count,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        if (request.Labels is { Count: > 0 })
            foreach (var label in request.Labels)
                card.Labels.Add(new CardLabel { Label = label });

        db.Cards.Add(card);

        db.Activities.Add(new ActivityEntity
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            Action = ActivityAction.CardCreated,
            Description = $"Created card '{card.Title}' in '{list.Title}'",
            BoardId = request.BoardId,
            BoardTitle = list.Board.Title,
            CardId = card.Id,
            CreatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync(ct);
        return card.ToDto();
    }
}
