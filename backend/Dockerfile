FROM mcr.microsoft.com/dotnet/sdk:8.0

WORKDIR /app

COPY PRReviewAI.Api/ .

RUN dotnet restore

EXPOSE 5001

CMD ["dotnet", "run", "--urls", "http://0.0.0.0:5001"]