using TaskManagement.Domain.Entities;

namespace TaskManagement.Application.Common;

public interface IJwtTokenService
{
    string GenerateToken(User user);
}
