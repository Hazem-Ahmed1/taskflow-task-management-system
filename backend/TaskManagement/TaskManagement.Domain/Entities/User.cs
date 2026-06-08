namespace TaskManagement.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "member";
    public string? Avatar { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Board> OwnedBoards { get; set; } = [];
    public ICollection<BoardMember> BoardMemberships { get; set; } = [];
    public ICollection<CardAssignee> AssignedCards { get; set; } = [];
    public ICollection<Comment> Comments { get; set; } = [];
    public ICollection<Activity> Activities { get; set; } = [];
    public ICollection<Notification> Notifications { get; set; } = [];
}
