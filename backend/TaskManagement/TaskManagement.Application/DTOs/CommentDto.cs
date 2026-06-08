namespace TaskManagement.Application.DTOs;

public record CommentDto(
    Guid Id,
    Guid CardId,
    Guid UserId,
    string UserName,
    string? UserAvatar,
    string Content,
    DateTime CreatedAt);
