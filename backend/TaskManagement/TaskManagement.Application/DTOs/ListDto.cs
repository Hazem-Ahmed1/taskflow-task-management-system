namespace TaskManagement.Application.DTOs;

public record ListDto(
    Guid Id,
    string Title,
    Guid BoardId,
    int Position,
    List<CardDto> Cards,
    DateTime CreatedAt,
    DateTime UpdatedAt);
