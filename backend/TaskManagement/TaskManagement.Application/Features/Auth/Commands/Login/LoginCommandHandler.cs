using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;

namespace TaskManagement.Application.Features.Auth.Commands.Login;

public class LoginCommandHandler(IApplicationDbContext db, IPasswordService passwords, IJwtTokenService jwt)
    : IRequestHandler<LoginCommand, LoginResponse>
{
    public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken ct)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email.ToLower(), ct)
            ?? throw new UnauthorizedAccessException("Invalid email or password.");

        if (!passwords.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        var token = jwt.GenerateToken(user);
        return new LoginResponse(token, user.ToDto());
    }
}
