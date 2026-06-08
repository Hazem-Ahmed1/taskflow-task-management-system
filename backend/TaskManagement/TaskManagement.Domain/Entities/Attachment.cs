namespace TaskManagement.Domain.Entities;

public class Attachment
{
    public Guid Id { get; set; }
    public Guid CardId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public Guid UploadedBy { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    public Card Card { get; set; } = null!;
}
