namespace TaskManagement.Application.DTOs;

public record BoardSummaryDto(
    Guid Id,
    string Title,
    string Description,
    Guid OwnerId,
    string OwnerName,
    string BackgroundColor,
    bool IsStarred,
    List<Guid> MemberIds,
    int ListCount,
    int CardCount,
    DateTime CreatedAt,
    DateTime UpdatedAt);
