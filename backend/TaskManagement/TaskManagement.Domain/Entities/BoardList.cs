namespace TaskManagement.Domain.Entities;

public class BoardList
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public Guid BoardId { get; set; }
    public int Position { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Board Board { get; set; } = null!;
    public ICollection<Card> Cards { get; set; } = [];
}
