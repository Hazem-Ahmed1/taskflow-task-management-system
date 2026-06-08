using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs;

namespace TaskManagement.Application.Features.Users.Queries.GetAll;

public record GetUsersQuery : IRequest<List<UserDto>>;

public class GetUsersHandler(IApplicationDbContext db) : IRequestHandler<GetUsersQuery, List<UserDto>>
{
    public async Task<List<UserDto>> Handle(GetUsersQuery _, CancellationToken ct) =>
        await db.Users.Select(u => u.ToDto()).ToListAsync(ct);
}
