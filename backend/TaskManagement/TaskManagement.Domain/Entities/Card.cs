using TaskManagement.Domain.Enums;

namespace TaskManagement.Domain.Entities;

public class Card
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid ListId { get; set; }
    public Guid BoardId { get; set; }
    public Priority Priority { get; set; } = Priority.Medium;
    public DateTime? Deadline { get; set; }
    public int Position { get; set; }
    public bool IsCompleted { get; set; }
    public string? CompletionNote { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public BoardList List { get; set; } = null!;
    public ICollection<CardAssignee> Assignees { get; set; } = [];
    public ICollection<CardLabel> Labels { get; set; } = [];
    public ICollection<Comment> Comments { get; set; } = [];
    public ICollection<Attachment> Attachments { get; set; } = [];
}
