using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;
using TaskManagement.Application.DTOs;

namespace TaskManagement.Application.Features.Users.Queries.Search;

public record SearchUsersQuery(string Term) : IRequest<List<UserDto>>;

public class SearchUsersHandler(IApplicationDbContext db) : IRequestHandler<SearchUsersQuery, List<UserDto>>
{
    public async Task<List<UserDto>> Handle(SearchUsersQuery request, CancellationToken ct)
    {
        var term = request.Term.ToLower();
        return await db.Users
            .Where(u => u.Name.ToLower().Contains(term) || u.Email.ToLower().Contains(term))
            .Select(u => u.ToDto())
            .ToListAsync(ct);
    }
}
