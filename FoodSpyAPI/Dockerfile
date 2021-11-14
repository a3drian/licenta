FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS base

ENV ASPNETCORE_ENVIRONMENT=Development

WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /src
COPY ["FoodSpyAPI.csproj", "."]
RUN dotnet restore "./FoodSpyAPI.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "FoodSpyAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "FoodSpyAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
CMD ASPNETCORE_URLS=http://*:$PORT dotnet FoodSpyAPI.dll