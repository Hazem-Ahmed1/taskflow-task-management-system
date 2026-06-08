using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs;
using TaskManagement.Domain.Entities;
using TaskManagement.Domain.Enums;
using ActivityEntity = TaskManagement.Domain.Entities.Activity;

namespace TaskManagement.Application.Features.Comments.Commands.Add;

public record AddCommentCommand(Guid CardId, Guid UserId, string Content) : IRequest<CommentDto>;

public class AddCommentHandler(IApplicationDbContext db) : IRequestHandler<AddCommentCommand, CommentDto>
{
    public async Task<CommentDto> Handle(AddCommentCommand request, CancellationToken ct)
    {
        var card = await db.Cards.FirstOrDefaultAsync(c => c.Id == request.CardId, ct)
            ?? throw new KeyNotFoundException("Card not found.");

        var user = await db.Users.FindAsync([request.UserId], ct)
            ?? throw new KeyNotFoundException("User not found.");

        var comment = new Comment
        {
            Id = Guid.NewGuid(),
            CardId = request.CardId,
            UserId = request.UserId,
            Content = request.Content,
            CreatedAt = DateTime.UtcNow
        };

        db.Comments.Add(comment);

        db.Activities.Add(new ActivityEntity
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            Action = ActivityAction.CommentAdded,
            Description = $"Commented on card '{card.Title}'",
            BoardId = card.BoardId,
            CardId = card.Id,
            CreatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync(ct);
        comment.User = user;
        return comment.ToDto();
    }
}
