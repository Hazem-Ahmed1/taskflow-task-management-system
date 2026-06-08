namespace TaskManagement.Domain.Entities;

public class CardAssignee
{
    public Guid CardId { get; set; }
    public Guid UserId { get; set; }

    public Card Card { get; set; } = null!;
    public User User { get; set; } = null!;
}
