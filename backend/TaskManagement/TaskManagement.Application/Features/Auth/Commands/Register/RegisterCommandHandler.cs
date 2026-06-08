using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Domain.Entities;

namespace TaskManagement.Application.Features.Auth.Commands.Register;

public class RegisterCommandHandler(IApplicationDbContext db, IPasswordService passwords, IJwtTokenService jwt)
    : IRequestHandler<RegisterCommand, RegisterResponse>
{
    public async Task<RegisterResponse> Handle(RegisterCommand request, CancellationToken ct)
    {
        var email = request.Email.ToLower().Trim();

        if (await db.Users.AnyAsync(u => u.Email == email, ct))
            throw new InvalidOperationException("An account with this email already exists.");

        if (request.Name.Trim().Length < 2)
            throw new ArgumentException("Name must be at least 2 characters.");

        if (request.Password.Length < 6)
            throw new ArgumentException("Password must be at least 6 characters.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Email = email,
            PasswordHash = passwords.Hash(request.Password),
            Role = "member",
            CreatedAt = DateTime.UtcNow
        };

        db.Users.Add(user);
        await db.SaveChangesAsync(ct);

        var token = jwt.GenerateToken(user);
        return new RegisterResponse(token, user.ToDto());
    }
}
