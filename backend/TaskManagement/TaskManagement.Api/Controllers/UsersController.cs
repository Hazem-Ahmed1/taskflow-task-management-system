using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.Common;
using TaskManagement.Application.Features.Users.Queries.GetAll;
using TaskManagement.Application.Features.Users.Queries.GetById;
using TaskManagement.Application.Features.Users.Queries.Search;

namespace TaskManagement.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController(IMediator mediator) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub") ?? throw new InvalidOperationException());

    [HttpGet("me")]
    public async Task<IActionResult> Me(CancellationToken ct)
    {
        try { return Ok(await mediator.Send(new GetUserByIdQuery(UserId), ct)); }
        catch (KeyNotFoundException) { return NotFound(); }
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct) =>
        Ok(await mediator.Send(new GetUsersQuery(), ct));

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q, CancellationToken ct) =>
        Ok(await mediator.Send(new SearchUsersQuery(q ?? string.Empty), ct));
}
