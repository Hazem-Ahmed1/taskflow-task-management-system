namespace TaskManagement.Application.DTOs;

public record BoardDetailDto(
    Guid Id,
    string Title,
    string Description,
    Guid OwnerId,
    string OwnerName,
    string BackgroundColor,
    bool IsStarred,
    List<UserDto> Members,
    List<ListDto> Lists,
    DateTime CreatedAt,
    DateTime UpdatedAt);
