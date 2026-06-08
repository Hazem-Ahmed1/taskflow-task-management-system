using TaskManagement.Domain.Entities;
using TaskManagement.Domain.Enums;

namespace TaskManagement.Infrastructure.Persistence;

public static class DbInitializer
{
    public static void Seed(TaskManagementDbContext db)
    {
        if (db.Users.Any()) return;

        var sara    = CreateUser("Sara Ahmed",     "sara@taskflow.io",   "sara123");
        var hazem   = CreateUser("Hazem Ahmed",    "hazem@taskflow.io",  "hazem123");
        var nour    = CreateUser("Nour El-Din",    "nour@taskflow.io",   "nour123");
        var khaled  = CreateUser("Khaled Mostafa", "khaled@taskflow.io", "khaled123");
        var lina    = CreateUser("Lina Mahmoud",   "lina@taskflow.io",   "lina123");

        db.Users.AddRange(sara, hazem, nour, khaled, lina);

        // Board 1 — E-Commerce Redesign (Sara owns)
        var board1 = new Board
        {
            Id = Guid.NewGuid(), Title = "E-Commerce Redesign",
            Description = "Redesign the e-commerce platform for better UX",
            OwnerId = sara.Id, BackgroundColor = "#0052cc",
            CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
        };
        var b1l1 = List(board1.Id, "Backlog",     0);
        var b1l2 = List(board1.Id, "In Progress", 1);
        var b1l3 = List(board1.Id, "Review",      2);
        var b1l4 = List(board1.Id, "Done",        3);
        b1l1.Cards.Add(Card("Redesign homepage hero section",          "Update the hero section with new branding",            b1l1.Id, board1.Id, Priority.High,   0, [sara.Id, hazem.Id],  ["frontend","design"]));
        b1l1.Cards.Add(Card("Update product card components",          "Modernize product cards with better imagery",          b1l1.Id, board1.Id, Priority.Medium, 1, [hazem.Id],           ["frontend"]));
        b1l2.Cards.Add(Card("Implement checkout flow redesign",        "Streamline the checkout process to reduce friction",   b1l2.Id, board1.Id, Priority.Urgent, 0, [sara.Id, khaled.Id], ["frontend","backend"]));
        b1l2.Cards.Add(Card("Add wishlist functionality",              "Allow users to save products to a wishlist",           b1l2.Id, board1.Id, Priority.Medium, 1, [hazem.Id],           ["feature"]));
        b1l3.Cards.Add(Card("Mobile responsive navigation",           "Fix responsive issues in the navigation menu",         b1l3.Id, board1.Id, Priority.High,   0, [sara.Id],            ["mobile","frontend"]));
        b1l4.Cards.Add(Card("Set up CI/CD pipeline",                  "Configure GitHub Actions for automated deployment",    b1l4.Id, board1.Id, Priority.Medium, 0, [khaled.Id],          ["devops"], true));
        b1l4.Cards.Add(Card("Database schema migration",              "Migrate old schema to new normalized structure",       b1l4.Id, board1.Id, Priority.High,   1, [khaled.Id, hazem.Id], ["backend","database"], true));
        board1.Members.Add(new BoardMember { BoardId = board1.Id, UserId = sara.Id });
        board1.Members.Add(new BoardMember { BoardId = board1.Id, UserId = hazem.Id });
        board1.Members.Add(new BoardMember { BoardId = board1.Id, UserId = khaled.Id });

        // Board 2 — Mobile App MVP (Hazem owns)
        var board2 = new Board
        {
            Id = Guid.NewGuid(), Title = "Mobile App MVP",
            Description = "Build the minimum viable product for our mobile application",
            OwnerId = hazem.Id, BackgroundColor = "#00875a",
            CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
        };
        var b2l1 = List(board2.Id, "To Do",         0);
        var b2l2 = List(board2.Id, "In Development", 1);
        var b2l3 = List(board2.Id, "QA",             2);
        var b2l4 = List(board2.Id, "Shipped",        3);
        b2l1.Cards.Add(Card("Design onboarding screens",       "Create wireframes and mockups for onboarding",     b2l1.Id, board2.Id, Priority.High,   0, [sara.Id],          ["design","mobile"]));
        b2l1.Cards.Add(Card("Set up push notifications",       "Integrate Firebase Cloud Messaging",               b2l1.Id, board2.Id, Priority.Medium, 1, [hazem.Id],         ["backend","mobile"]));
        b2l2.Cards.Add(Card("User authentication module",      "Implement login, register, and OAuth",             b2l2.Id, board2.Id, Priority.Urgent, 0, [hazem.Id, nour.Id], ["auth","backend"]));
        b2l2.Cards.Add(Card("Home feed component",             "Build the main activity feed for users",           b2l2.Id, board2.Id, Priority.High,   1, [nour.Id],           ["frontend","mobile"]));
        b2l3.Cards.Add(Card("Profile page testing",            "QA the user profile page across devices",          b2l3.Id, board2.Id, Priority.Medium, 0, [sara.Id],           ["qa","mobile"]));
        b2l4.Cards.Add(Card("App icon and splash screen",      "Design and integrate final app icon",              b2l4.Id, board2.Id, Priority.Low,    0, [sara.Id],           ["design"], true));
        b2l4.Cards.Add(Card("Beta release to TestFlight",      "Deploy beta build to TestFlight for testers",      b2l4.Id, board2.Id, Priority.High,   1, [hazem.Id],          ["devops"], true));
        board2.Members.Add(new BoardMember { BoardId = board2.Id, UserId = hazem.Id });
        board2.Members.Add(new BoardMember { BoardId = board2.Id, UserId = sara.Id });
        board2.Members.Add(new BoardMember { BoardId = board2.Id, UserId = nour.Id });

        // Board 3 — Marketing Q2 Campaign (Nour owns)
        var board3 = new Board
        {
            Id = Guid.NewGuid(), Title = "Marketing Q2 Campaign",
            Description = "Plan and execute Q2 marketing initiatives",
            OwnerId = nour.Id, BackgroundColor = "#6554c0",
            CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
        };
        var b3l1 = List(board3.Id, "Ideas",       0);
        var b3l2 = List(board3.Id, "In Progress", 1);
        var b3l3 = List(board3.Id, "Done",        2);
        b3l1.Cards.Add(Card("Social media strategy",  "Define content strategy for Q2 social channels",   b3l1.Id, board3.Id, Priority.High,   0, [nour.Id],         ["marketing","social"]));
        b3l1.Cards.Add(Card("Email newsletter revamp","Redesign the monthly newsletter template",          b3l1.Id, board3.Id, Priority.Medium, 1, [lina.Id],         ["email","design"]));
        b3l2.Cards.Add(Card("Q2 blog content calendar","Plan and schedule blog posts for Q2",             b3l2.Id, board3.Id, Priority.Medium, 0, [nour.Id, lina.Id], ["content","marketing"]));
        b3l2.Cards.Add(Card("Influencer outreach",     "Identify and contact relevant influencers",       b3l2.Id, board3.Id, Priority.Low,    1, [lina.Id],          ["partnerships"]));
        b3l3.Cards.Add(Card("Q1 performance review",  "Analyze Q1 marketing metrics and KPIs",           b3l3.Id, board3.Id, Priority.High,   0, [nour.Id],          ["analytics"], true));
        board3.Members.Add(new BoardMember { BoardId = board3.Id, UserId = nour.Id });
        board3.Members.Add(new BoardMember { BoardId = board3.Id, UserId = lina.Id });

        // Board 4 — DevOps & Infrastructure (Khaled owns)
        var board4 = new Board
        {
            Id = Guid.NewGuid(), Title = "DevOps & Infrastructure",
            Description = "Infrastructure improvements and DevOps automation",
            OwnerId = khaled.Id, BackgroundColor = "#de350b",
            CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
        };
        var b4l1 = List(board4.Id, "Pending",     0);
        var b4l2 = List(board4.Id, "In Progress", 1);
        var b4l3 = List(board4.Id, "Done",        2);
        b4l1.Cards.Add(Card("Kubernetes cluster migration",    "Migrate services to k8s cluster",                   b4l1.Id, board4.Id, Priority.Urgent, 0, [khaled.Id],          ["infrastructure","devops"]));
        b4l1.Cards.Add(Card("Security audit",                  "Perform comprehensive security assessment",          b4l1.Id, board4.Id, Priority.High,   1, [khaled.Id, sara.Id], ["security"]));
        b4l2.Cards.Add(Card("Monitoring dashboard setup",      "Set up Grafana dashboards for all services",        b4l2.Id, board4.Id, Priority.Medium, 0, [hazem.Id],           ["monitoring","devops"]));
        b4l2.Cards.Add(Card("Auto-scaling policies",           "Define and implement auto-scaling rules",           b4l2.Id, board4.Id, Priority.High,   1, [khaled.Id],          ["infrastructure"]));
        b4l3.Cards.Add(Card("SSL certificate renewal",         "Renew SSL certs for all production domains",        b4l3.Id, board4.Id, Priority.Medium, 0, [khaled.Id],          ["security"], true));
        b4l3.Cards.Add(Card("Backup strategy implementation",  "Set up automated daily backups",                    b4l3.Id, board4.Id, Priority.High,   1, [khaled.Id, hazem.Id], ["backup","infrastructure"], true));
        board4.Members.Add(new BoardMember { BoardId = board4.Id, UserId = khaled.Id });
        board4.Members.Add(new BoardMember { BoardId = board4.Id, UserId = sara.Id });
        board4.Members.Add(new BoardMember { BoardId = board4.Id, UserId = hazem.Id });

        // Board 5 — HR Onboarding Portal (Lina owns)
        var board5 = new Board
        {
            Id = Guid.NewGuid(), Title = "HR Onboarding Portal",
            Description = "Build a digital onboarding portal for new employees",
            OwnerId = lina.Id, BackgroundColor = "#ff8b00",
            CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
        };
        var b5l1 = List(board5.Id, "To Design",  0);
        var b5l2 = List(board5.Id, "In Progress", 1);
        var b5l3 = List(board5.Id, "Done",        2);
        b5l1.Cards.Add(Card("Onboarding checklist UI",        "Design the interactive checklist for new hires",    b5l1.Id, board5.Id, Priority.High,   0, [lina.Id],         ["design","hr"]));
        b5l1.Cards.Add(Card("Employee directory integration", "Connect with existing HR system for employee data", b5l1.Id, board5.Id, Priority.Medium, 1, [nour.Id],          ["integration","backend"]));
        b5l2.Cards.Add(Card("Document upload feature",        "Allow employees to upload required documents",      b5l2.Id, board5.Id, Priority.Medium, 0, [lina.Id, nour.Id], ["feature","hr"]));
        b5l3.Cards.Add(Card("Welcome email automation",       "Set up automated welcome emails for new hires",     b5l3.Id, board5.Id, Priority.Low,    0, [lina.Id],          ["email","automation"], true));
        board5.Members.Add(new BoardMember { BoardId = board5.Id, UserId = lina.Id });
        board5.Members.Add(new BoardMember { BoardId = board5.Id, UserId = nour.Id });

        db.Boards.AddRange(board1, board2, board3, board4, board5);
        db.Lists.AddRange(b1l1, b1l2, b1l3, b1l4, b2l1, b2l2, b2l3, b2l4, b3l1, b3l2, b3l3, b4l1, b4l2, b4l3, b5l1, b5l2, b5l3);

        db.SaveChanges();
    }

    private static User CreateUser(string name, string email, string password) => new()
    {
        Id = Guid.NewGuid(),
        Name = name,
        Email = email,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(password, workFactor: 11),
        Role = "member",
        CreatedAt = DateTime.UtcNow
    };

    private static BoardList List(Guid boardId, string title, int position) => new()
    {
        Id = Guid.NewGuid(),
        Title = title,
        BoardId = boardId,
        Position = position,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };

    private static Card Card(
        string title, string description,
        Guid listId, Guid boardId,
        Priority priority, int position,
        List<Guid> assigneeIds, List<string> labels,
        bool isCompleted = false) =>
        new()
        {
            Id = Guid.NewGuid(),
            Title = title,
            Description = description,
            ListId = listId,
            BoardId = boardId,
            Priority = priority,
            Position = position,
            IsCompleted = isCompleted,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Assignees = assigneeIds.Select(uid => new CardAssignee { UserId = uid }).ToList(),
            Labels = labels.Select(l => new CardLabel { Label = l }).ToList()
        };
}
