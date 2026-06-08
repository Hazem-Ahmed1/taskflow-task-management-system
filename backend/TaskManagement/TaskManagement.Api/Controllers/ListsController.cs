using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.Features.Lists.Commands.Create;
using TaskManagement.Application.Features.Lists.Commands.Delete;
using TaskManagement.Application.Features.Lists.Commands.Reorder;
using TaskManagement.Application.Features.Lists.Commands.Update;

namespace TaskManagement.Api.Controllers;

[ApiController]
[Authorize]
public class ListsController(IMediator mediator) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub") ?? throw new InvalidOperationException());

    [HttpPost("api/boards/{boardId:guid}/lists")]
    public async Task<IActionResult> Create(Guid boardId, [FromBody] CreateListRequest req, CancellationToken ct)
    {
        try
        {
            var result = await mediator.Send(new CreateListCommand(boardId, UserId, req.Title), ct);
            return Created(string.Empty, result);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    [HttpPut("api/lists/{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateListRequest req, CancellationToken ct)
    {
        try { await mediator.Send(new UpdateListCommand(id, UserId, req.Title), ct); return NoContent(); }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    [HttpDelete("api/lists/{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        try { await mediator.Send(new DeleteListCommand(id, UserId), ct); return NoContent(); }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    [HttpPut("api/boards/{boardId:guid}/lists/reorder")]
    public async Task<IActionResult> Reorder(Guid boardId, [FromBody] ReorderRequest req, CancellationToken ct)
    {
        try { await mediator.Send(new ReorderListsCommand(boardId, UserId, req.OrderedListIds), ct); return NoContent(); }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }
}

public record CreateListRequest(string Title);
public record UpdateListRequest(string Title);
public record ReorderRequest(List<Guid> OrderedListIds);
