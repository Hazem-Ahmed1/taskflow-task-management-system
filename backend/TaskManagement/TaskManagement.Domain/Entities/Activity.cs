using TaskManagement.Domain.Enums;

namespace TaskManagement.Domain.Entities;

public class Activity
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public ActivityAction Action { get; set; }
    public string Description { get; set; } = string.Empty;
    public Guid? BoardId { get; set; }
    public string? BoardTitle { get; set; }
    public Guid? CardId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public Board? Board { get; set; }
}
