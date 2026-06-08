namespace TaskManagement.Application.DTOs;

public record UserDto(
    Guid Id,
    string Name,
    string Email,
    string Role,
    string? Avatar,
    DateTime CreatedAt);
