namespace TaskManagement.Application.DTOs;

public record ActivityDto(
    Guid Id,
    Guid UserId,
    string UserName,
    string? UserAvatar,
    string Action,
    string Description,
    Guid? BoardId,
    string? BoardTitle,
    Guid? CardId,
    DateTime CreatedAt);
