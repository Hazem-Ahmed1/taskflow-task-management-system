namespace TaskManagement.Domain.Entities;

public class Board
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid OwnerId { get; set; }
    public string BackgroundColor { get; set; } = "#0052cc";
    public bool IsStarred { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User Owner { get; set; } = null!;
    public ICollection<BoardMember> Members { get; set; } = [];
    public ICollection<BoardList> Lists { get; set; } = [];
    public ICollection<Activity> Activities { get; set; } = [];
}
