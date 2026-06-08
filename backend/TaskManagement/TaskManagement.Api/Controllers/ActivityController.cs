using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.Features.Activity.Queries.GetAll;
using TaskManagement.Application.Features.Activity.Queries.GetByBoard;

namespace TaskManagement.Api.Controllers;

[ApiController]
[Authorize]
public class ActivityController(IMediator mediator) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub") ?? throw new InvalidOperationException());

    [HttpGet("api/activity")]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken ct = default) =>
        Ok(await mediator.Send(new GetActivityQuery(UserId, page, pageSize), ct));

    [HttpGet("api/boards/{boardId:guid}/activity")]
    public async Task<IActionResult> GetByBoard(Guid boardId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken ct = default) =>
        Ok(await mediator.Send(new GetBoardActivityQuery(boardId, page, pageSize), ct));
}
