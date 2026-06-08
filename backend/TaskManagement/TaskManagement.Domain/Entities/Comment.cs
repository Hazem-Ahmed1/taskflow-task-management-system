namespace TaskManagement.Domain.Entities;

public class Comment
{
    public Guid Id { get; set; }
    public Guid CardId { get; set; }
    public Guid UserId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Card Card { get; set; } = null!;
    public User User { get; set; } = null!;
}
