using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common;

namespace TaskManagement.Application.Features.Comments.Commands.Delete;

public record DeleteCommentCommand(Guid CommentId, Guid UserId) : IRequest;

public class DeleteCommentHandler(IApplicationDbContext db) : IRequestHandler<DeleteCommentCommand>
{
    public async Task Handle(DeleteCommentCommand request, CancellationToken ct)
    {
        var comment = await db.Comments.FirstOrDefaultAsync(c => c.Id == request.CommentId, ct)
            ?? throw new KeyNotFoundException("Comment not found.");

        if (comment.UserId != request.UserId)
            throw new UnauthorizedAccessException("You can only delete your own comments.");

        db.Comments.Remove(comment);
        await db.SaveChangesAsync(ct);
    }
}
