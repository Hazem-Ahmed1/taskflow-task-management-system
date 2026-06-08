using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Domain.Entities;
using TaskManagement.Domain.Enums;

namespace TaskManagement.Infrastructure.Persistence;

public class TaskManagementDbContext(DbContextOptions<TaskManagementDbContext> options)
    : DbContext(options), IApplicationDbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Board> Boards => Set<Board>();
    public DbSet<BoardMember> BoardMembers => Set<BoardMember>();
    public DbSet<BoardList> Lists => Set<BoardList>();
    public DbSet<Card> Cards => Set<Card>();
    public DbSet<CardAssignee> CardAssignees => Set<CardAssignee>();
    public DbSet<CardLabel> CardLabels => Set<CardLabel>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<Attachment> Attachments => Set<Attachment>();
    public DbSet<Activity> Activities => Set<Activity>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.Entity<BoardMember>().HasKey(bm => new { bm.BoardId, bm.UserId });
        mb.Entity<CardAssignee>().HasKey(ca => new { ca.CardId, ca.UserId });
        mb.Entity<CardLabel>().HasKey(cl => new { cl.CardId, cl.Label });

        mb.Entity<Board>()
            .HasOne(b => b.Owner)
            .WithMany(u => u.OwnedBoards)
            .HasForeignKey(b => b.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        mb.Entity<BoardMember>()
            .HasOne(bm => bm.Board).WithMany(b => b.Members).HasForeignKey(bm => bm.BoardId).OnDelete(DeleteBehavior.Cascade);
        mb.Entity<BoardMember>()
            .HasOne(bm => bm.User).WithMany(u => u.BoardMemberships).HasForeignKey(bm => bm.UserId).OnDelete(DeleteBehavior.Restrict);

        mb.Entity<BoardList>()
            .HasOne(l => l.Board).WithMany(b => b.Lists).HasForeignKey(l => l.BoardId).OnDelete(DeleteBehavior.Cascade);

        mb.Entity<Card>()
            .HasOne(c => c.List).WithMany(l => l.Cards).HasForeignKey(c => c.ListId).OnDelete(DeleteBehavior.Cascade);

        mb.Entity<CardAssignee>()
            .HasOne(ca => ca.Card).WithMany(c => c.Assignees).HasForeignKey(ca => ca.CardId).OnDelete(DeleteBehavior.Cascade);
        mb.Entity<CardAssignee>()
            .HasOne(ca => ca.User).WithMany(u => u.AssignedCards).HasForeignKey(ca => ca.UserId).OnDelete(DeleteBehavior.Restrict);

        mb.Entity<CardLabel>()
            .HasOne(cl => cl.Card).WithMany(c => c.Labels).HasForeignKey(cl => cl.CardId).OnDelete(DeleteBehavior.Cascade);

        mb.Entity<Comment>()
            .HasOne(c => c.Card).WithMany(c => c.Comments).HasForeignKey(c => c.CardId).OnDelete(DeleteBehavior.Cascade);
        mb.Entity<Comment>()
            .HasOne(c => c.User).WithMany(u => u.Comments).HasForeignKey(c => c.UserId).OnDelete(DeleteBehavior.Restrict);

        mb.Entity<Attachment>()
            .HasOne(a => a.Card).WithMany(c => c.Attachments).HasForeignKey(a => a.CardId).OnDelete(DeleteBehavior.Cascade);

        mb.Entity<Activity>()
            .HasOne(a => a.User).WithMany(u => u.Activities).HasForeignKey(a => a.UserId).OnDelete(DeleteBehavior.Restrict);
        mb.Entity<Activity>()
            .HasOne(a => a.Board).WithMany(b => b.Activities).HasForeignKey(a => a.BoardId).IsRequired(false).OnDelete(DeleteBehavior.SetNull);

        mb.Entity<Notification>()
            .HasOne(n => n.User).WithMany(u => u.Notifications).HasForeignKey(n => n.UserId).OnDelete(DeleteBehavior.Cascade);

        // Store enums as strings
        mb.Entity<Card>().Property(c => c.Priority).HasConversion<string>();
        mb.Entity<Activity>().Property(a => a.Action).HasConversion<string>();
        mb.Entity<Notification>().Property(n => n.Type).HasConversion<string>();

        // Indexes
        mb.Entity<User>().HasIndex(u => u.Email).IsUnique();
        mb.Entity<BoardList>().HasIndex(l => new { l.BoardId, l.Position });
        mb.Entity<Card>().HasIndex(c => new { c.ListId, c.Position });
        mb.Entity<Notification>().HasIndex(n => new { n.UserId, n.IsRead });
        mb.Entity<Activity>().HasIndex(a => a.CreatedAt);
    }
}
