using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.Features.Boards.Commands.AddMember;
using TaskManagement.Application.Features.Boards.Commands.Create;
using TaskManagement.Application.Features.Boards.Commands.Delete;
using TaskManagement.Application.Features.Boards.Commands.RemoveMember;
using TaskManagement.Application.Features.Boards.Commands.ToggleStar;
using TaskManagement.Application.Features.Boards.Commands.Update;
using TaskManagement.Application.Features.Boards.Queries.GetAll;
using TaskManagement.Application.Features.Boards.Queries.GetById;

namespace TaskManagement.Api.Controllers;

[ApiController]
[Route("api/boards")]
[Authorize]
public class BoardsController(IMediator mediator) : ControllerBase
{
    private Guid UserId
    {
        get
        {
            var id = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub")
                ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            return Guid.Parse(id ?? throw new InvalidOperationException("User ID claim not found."));
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct) =>
        Ok(await mediator.Send(new GetBoardsQuery(UserId), ct));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        try { return Ok(await mediator.Send(new GetBoardByIdQuery(id, UserId), ct)); }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBoardRequest req, CancellationToken ct)
    {
        var result = await mediator.Send(new CreateBoardCommand(req.Title, req.Description, req.BackgroundColor, UserId), ct);
        return Created($"/api/boards/{result.Id}", result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateBoardRequest req, CancellationToken ct)
    {
        try
        {
            await mediator.Send(new UpdateBoardCommand(id, UserId, req.Title, req.Description, req.BackgroundColor), ct);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        try { await mediator.Send(new DeleteBoardCommand(id, UserId), ct); return NoContent(); }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    [HttpPost("{id:guid}/members")]
    public async Task<IActionResult> AddMember(Guid id, [FromBody] MemberRequest req, CancellationToken ct)
    {
        try { await mediator.Send(new AddMemberCommand(id, UserId, req.UserId), ct); return NoContent(); }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
    }

    [HttpDelete("{id:guid}/members/{memberId:guid}")]
    public async Task<IActionResult> RemoveMember(Guid id, Guid memberId, CancellationToken ct)
    {
        try { await mediator.Send(new RemoveMemberCommand(id, UserId, memberId), ct); return NoContent(); }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
        catch (UnauthorizedAccessException) { return Forbid(); }
        catch (InvalidOperationException ex) { return BadRequest(new { error = ex.Message }); }
    }

    [HttpPut("{id:guid}/star")]
    public async Task<IActionResult> ToggleStar(Guid id, CancellationToken ct)
    {
        try { var starred = await mediator.Send(new ToggleStarCommand(id, UserId), ct); return Ok(new { isStarred = starred }); }
        catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
    }
}

public record CreateBoardRequest(string Title, string Description, string BackgroundColor);
public record UpdateBoardRequest(string? Title, string? Description, string? BackgroundColor);
public record MemberRequest(Guid UserId);
