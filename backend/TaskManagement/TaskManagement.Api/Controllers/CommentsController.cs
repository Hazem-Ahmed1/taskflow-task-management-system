using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.Features.Comments.Commands.Add;
using TaskManagement.Application.Features.Comments.Commands.Delete;
using TaskManagement.Application.Features.Comments.Queries.GetByCard;

namespace TaskManagement.Api.Controllers;

[ApiController]
[Authorize]
public class CommentsController(IMediator mediator) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub") ?? throw new InvalidOperationException());

    [HttpGet("api/cards/{cardId:guid}/comments")]
    public async Task<IActionResult> GetByCard(Guid cardId, CancellationToken ct) =>
        Ok(await mediator.Send(new GetCommentsQuery(cardId), ct));

    [HttpPost("api/cards/{cardId:guid}/comments")]
    public async Task<IActionResult> Add(Guid cardId, [FromBody] AddCommentRequest req, CancellationToken ct)
    {
        try
        {
            var result = await mediator.Send(new AddCommentCommand(cardId, UserId, req.Content), ct);
            return Created(string.Empty, result);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
    }

    [HttpDelete("api/comments/{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        try { await mediator.Send(new DeleteCommentCommand(id, UserId), ct); return NoContent(); }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }
}

public record AddCommentRequest(string Content);
