namespace TaskManagement.Application.DTOs;

public record NotificationDto(
    Guid Id,
    Guid UserId,
    string Type,
    string Title,
    string Message,
    string RelatedEntityId,
    bool IsRead,
    DateTime CreatedAt);
