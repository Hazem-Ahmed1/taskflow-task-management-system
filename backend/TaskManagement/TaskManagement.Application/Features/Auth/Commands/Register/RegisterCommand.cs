using MediatR;

namespace TaskManagement.Application.Features.Auth.Commands.Register;

public record RegisterCommand(string Name, string Email, string Password) : IRequest<RegisterResponse>;

public record RegisterResponse(string Token, DTOs.UserDto User);
