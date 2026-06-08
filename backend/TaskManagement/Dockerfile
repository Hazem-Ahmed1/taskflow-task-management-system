FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Restore — copy csproj files first for layer caching
COPY TaskManagement.Api/TaskManagement.Api.csproj           TaskManagement.Api/
COPY TaskManagement.Application/TaskManagement.Application.csproj TaskManagement.Application/
COPY TaskManagement.Domain/TaskManagement.Domain.csproj     TaskManagement.Domain/
COPY TaskManagement.Infrastructure/TaskManagement.Infrastructure.csproj TaskManagement.Infrastructure/

RUN dotnet restore TaskManagement.Api/TaskManagement.Api.csproj

# Build & publish
COPY . .
RUN dotnet publish TaskManagement.Api/TaskManagement.Api.csproj \
    -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
EXPOSE 80
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "TaskManagement.Api.dll"]
