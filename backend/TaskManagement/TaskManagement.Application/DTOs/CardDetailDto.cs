namespace TaskManagement.Application.DTOs;

public record CardDetailDto(
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
    List<UserDto> AssignedUsers,
    List<string> Labels,
    List<CommentDto> Comments,
    List<AttachmentDto> Attachments,
    DateTime CreatedAt,
    DateTime UpdatedAt);
