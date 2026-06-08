using TaskManagement.Application.DTOs;
using TaskManagement.Domain.Entities;

namespace TaskManagement.Application.Common;

public static class MappingExtensions
{
    public static UserDto ToDto(this User u) =>
        new(u.Id, u.Name, u.Email, u.Role, u.Avatar, u.CreatedAt);

    public static CardDto ToDto(this Card c) =>
        new(c.Id, c.Title, c.Description, c.ListId, c.BoardId,
            c.Priority.ToString().ToLowerInvariant(), c.Deadline, c.Position,
            c.IsCompleted, c.CompletionNote,
            c.Assignees.Select(a => a.UserId).ToList(),
            c.Labels.Select(l => l.Label).ToList(),
            c.Comments.Count, c.Attachments.Count,
            c.CreatedAt, c.UpdatedAt);

    public static ListDto ToDto(this BoardList l) =>
        new(l.Id, l.Title, l.BoardId, l.Position,
            l.Cards.OrderBy(c => c.Position).Select(c => c.ToDto()).ToList(),
            l.CreatedAt, l.UpdatedAt);

    public static BoardSummaryDto ToSummaryDto(this Board b) =>
        new(b.Id, b.Title, b.Description, b.OwnerId, b.Owner.Name,
            b.BackgroundColor, b.IsStarred,
            b.Members.Select(m => m.UserId).ToList(),
            b.Lists.Count,
            b.Lists.Sum(l => l.Cards.Count),
            b.CreatedAt, b.UpdatedAt);

    public static BoardDetailDto ToDetailDto(this Board b) =>
        new(b.Id, b.Title, b.Description, b.OwnerId, b.Owner.Name,
            b.BackgroundColor, b.IsStarred,
            b.Members.Select(m => m.User.ToDto()).ToList(),
            b.Lists.OrderBy(l => l.Position).Select(l => l.ToDto()).ToList(),
            b.CreatedAt, b.UpdatedAt);

    public static CommentDto ToDto(this Comment c) =>
        new(c.Id, c.CardId, c.UserId, c.User.Name, c.User.Avatar, c.Content, c.CreatedAt);

    public static NotificationDto ToDto(this Notification n) =>
        new(n.Id, n.UserId, n.Type.ToString(), n.Title, n.Message, n.RelatedEntityId, n.IsRead, n.CreatedAt);

    public static ActivityDto ToDto(this Activity a) =>
        new(a.Id, a.UserId, a.User.Name, a.User.Avatar, a.Action.ToString(),
            a.Description, a.BoardId, a.BoardTitle, a.CardId, a.CreatedAt);
}
