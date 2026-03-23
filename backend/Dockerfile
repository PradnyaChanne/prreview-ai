FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY PRReviewAI.Api/ .
RUN dotnet restore
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 5001
CMD ["dotnet", "PRReviewAI.Api.dll", "--urls", "http://0.0.0.0:5001"]