namespace TaskManagement.Application.DTOs;

public record AttachmentDto(
    Guid Id,
    Guid CardId,
    string FileName,
    string FileUrl,
    Guid UploadedBy,
    DateTime UploadedAt);
