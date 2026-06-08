using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Domain.Entities;
using TaskManagement.Domain.Enums;
using ActivityEntity = TaskManagement.Domain.Entities.Activity;

namespace TaskManagement.Application.Features.Boards.Commands.AddMember;

public record AddMemberCommand(Guid BoardId, Guid RequesterId, Guid NewMemberId) : IRequest;

public class AddMemberHandler(IApplicationDbContext db) : IRequestHandler<AddMemberCommand>
{
    public async Task Handle(AddMemberCommand request, CancellationToken ct)
    {
        var board = await db.Boards.Include(b => b.Members).FirstOrDefaultAsync(b => b.Id == request.BoardId, ct)
            ?? throw new KeyNotFoundException("Board not found.");

        if (board.OwnerId != request.RequesterId)
            throw new UnauthorizedAccessException("Only the owner can add members.");

        if (board.Members.Any(m => m.UserId == request.NewMemberId))
            return;

        var newUser = await db.Users.FindAsync([request.NewMemberId], ct)
            ?? throw new KeyNotFoundException("User not found.");

        db.BoardMembers.Add(new BoardMember { BoardId = request.BoardId, UserId = request.NewMemberId });

        db.Notifications.Add(new Notification
        {
            Id = Guid.NewGuid(),
            UserId = request.NewMemberId,
            Type = NotificationType.BoardInvitation,
            Title = "Board Invitation",
            Message = $"You were added to board '{board.Title}'",
            RelatedEntityId = request.BoardId.ToString(),
            CreatedAt = DateTime.UtcNow
        });

        db.Activities.Add(new ActivityEntity
        {
            Id = Guid.NewGuid(),
            UserId = request.RequesterId,
            Action = ActivityAction.MemberAdded,
            Description = $"Added {newUser.Name} to board '{board.Title}'",
            BoardId = request.BoardId,
            BoardTitle = board.Title,
            CreatedAt = DateTime.UtcNow
        });

        board.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
    }
}
