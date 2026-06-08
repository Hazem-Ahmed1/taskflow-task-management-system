using Microsoft.EntityFrameworkCore;
using TaskManagement.Domain.Entities;

namespace TaskManagement.Application.Common;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Board> Boards { get; }
    DbSet<BoardMember> BoardMembers { get; }
    DbSet<BoardList> Lists { get; }
    DbSet<Card> Cards { get; }
    DbSet<CardAssignee> CardAssignees { get; }
    DbSet<CardLabel> CardLabels { get; }
    DbSet<Comment> Comments { get; }
    DbSet<Attachment> Attachments { get; }
    DbSet<Activity> Activities { get; }
    DbSet<Notification> Notifications { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
