using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.Features.Cards.Commands.AssignUser;
using TaskManagement.Application.Features.Cards.Commands.Complete;
using TaskManagement.Application.Features.Cards.Commands.Create;
using TaskManagement.Application.Features.Cards.Commands.Delete;
using TaskManagement.Application.Features.Cards.Commands.Move;
using TaskManagement.Application.Features.Cards.Commands.UnassignUser;
using TaskManagement.Application.Features.Cards.Commands.Update;
using TaskManagement.Application.Features.Cards.Queries.GetById;

namespace TaskManagement.Api.Controllers;

[ApiController]
[Authorize]
public class CardsController(IMediator mediator) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub") ?? throw new InvalidOperationException());

    [HttpPost("api/lists/{listId:guid}/cards")]
    public async Task<IActionResult> Create(Guid listId, [FromBody] CreateCardRequest req, CancellationToken ct)
    {
        try
        {
            var result = await mediator.Send(
                new CreateCardCommand(listId, req.BoardId, UserId, req.Title, req.Description, req.Priority, req.Deadline, req.Labels), ct);
            return Created(string.Empty, result);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
    }

    [HttpGet("api/cards/{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        try { return Ok(await mediator.Send(new GetCardByIdQuery(id), ct)); }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
    }

    [HttpPut("api/cards/{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCardRequest req, CancellationToken ct)
    {
        try
        {
            await mediator.Send(new UpdateCardCommand(id, UserId, req.Title, req.Description, req.Priority, req.Deadline, req.Labels), ct);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
    }

    [HttpDelete("api/cards/{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        try { await mediator.Send(new DeleteCardCommand(id, UserId), ct); return NoContent(); }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
    }

    [HttpPut("api/cards/{id:guid}/move")]
    public async Task<IActionResult> Move(Guid id, [FromBody] MoveCardRequest req, CancellationToken ct)
    {
        try { await mediator.Send(new MoveCardCommand(id, UserId, req.TargetListId, req.NewPosition), ct); return NoContent(); }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
    }

    [HttpPost("api/cards/{id:guid}/assignees/{userId:guid}")]
    public async Task<IActionResult> Assign(Guid id, Guid userId, CancellationToken ct)
    {
        try { await mediator.Send(new AssignUserCommand(id, userId, UserId), ct); return NoContent(); }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
    }

    [HttpDelete("api/cards/{id:guid}/assignees/{userId:guid}")]
    public async Task<IActionResult> Unassign(Guid id, Guid userId, CancellationToken ct)
    {
        await mediator.Send(new UnassignUserCommand(id, userId), ct);
        return NoContent();
    }

    [HttpPut("api/cards/{id:guid}/complete")]
    public async Task<IActionResult> Complete(Guid id, [FromBody] CompleteCardRequest req, CancellationToken ct)
    {
        try { await mediator.Send(new CompleteCardCommand(id, UserId, req.IsCompleted, req.CompletionNote), ct); return NoContent(); }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
    }
}

public record CreateCardRequest(Guid BoardId, string Title, string Description, string Priority, DateTime? Deadline, List<string>? Labels);
public record UpdateCardRequest(string? Title, string? Description, string? Priority, DateTime? Deadline, List<string>? Labels);
public record MoveCardRequest(Guid TargetListId, int NewPosition);
public record CompleteCardRequest(bool IsCompleted, string? CompletionNote);
