namespace TaskManagement.Domain.Entities;

public class CardLabel
{
    public Guid CardId { get; set; }
    public string Label { get; set; } = string.Empty;

    public Card Card { get; set; } = null!;
}
