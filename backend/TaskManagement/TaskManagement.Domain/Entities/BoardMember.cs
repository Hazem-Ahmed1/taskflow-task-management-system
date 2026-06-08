namespace TaskManagement.Domain.Entities;

public class BoardMember
{
    public Guid BoardId { get; set; }
    public Guid UserId { get; set; }

    public Board Board { get; set; } = null!;
    public User User { get; set; } = null!;
}
