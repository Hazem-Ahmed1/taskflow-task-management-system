namespace TaskManagement.Application.DTOs;

public record CardDto(
    Guid Id,
    string Title,
    string Description,
    Guid ListId,
    Guid BoardId,
    string Priority,
    DateTime? Deadline,
    int Position,
    bool IsCompleted,
    string? CompletionNote,
    List<Guid> AssignedUserIds,
    List<string> Labels,
    int CommentCount,
    int AttachmentCount,
    DateTime CreatedAt,
    DateTime UpdatedAt);
