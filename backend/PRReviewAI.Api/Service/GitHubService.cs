using System.Net.Http.Headers;
using System.Text.Json;
using PRReviewAI.Api.Models;

namespace PRReviewAI.Api.Services
{
    public class GitHubService
    {
        private readonly HttpClient _httpClient;
        private readonly string _clientId;
        private readonly string _clientSecret;

        public GitHubService(IConfiguration configuration)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.UserAgent
                .Add(new System.Net.Http.Headers.ProductInfoHeaderValue("PRReviewAI", "1.0"));
            _clientId = configuration["GitHub:ClientId"] ?? string.Empty;
            _clientSecret = configuration["GitHub:ClientSecret"] ?? string.Empty;
        }

        public async Task<string> ExchangeCodeForToken(string code)
        {
            var url = $"https://github.com/login/oauth/access_token" +
                      $"?client_id={_clientId}" +
                      $"&client_secret={_clientSecret}" +
                      $"&code={code}";

            var request = new HttpRequestMessage(HttpMethod.Post, url);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await _httpClient.SendAsync(request);
            var body = await response.Content.ReadAsStringAsync();

            var doc = JsonDocument.Parse(body);
            return doc.RootElement.GetProperty("access_token").GetString() ?? string.Empty;
        }

        public async Task<List<GitHubRepo>> GetRepos(string accessToken)
        {
            var request = new HttpRequestMessage(HttpMethod.Get,
                "https://api.github.com/user/repos?sort=updated&per_page=20");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _httpClient.SendAsync(request);
            var body = await response.Content.ReadAsStringAsync();

            return JsonSerializer.Deserialize<List<GitHubRepo>>(body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                ?? new List<GitHubRepo>();
        }

        public async Task<List<GitHubPR>> GetPullRequests(string accessToken, string owner, string repo)
        {
            var request = new HttpRequestMessage(HttpMethod.Get,
                $"https://api.github.com/repos/{owner}/{repo}/pulls?state=open");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _httpClient.SendAsync(request);
            var body = await response.Content.ReadAsStringAsync();

            var prs = JsonSerializer.Deserialize<List<JsonElement>>(body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                ?? new List<JsonElement>();

            return prs.Select(pr => new GitHubPR
            {
                Number = pr.GetProperty("number").GetInt32(),
                Title = pr.GetProperty("title").GetString() ?? string.Empty,
                State = pr.GetProperty("state").GetString() ?? string.Empty,
                Url = pr.GetProperty("html_url").GetString() ?? string.Empty,
            }).ToList();
        }

        public async Task<List<GitHubFile>> GetPRFiles(string accessToken, string owner, string repo, int prNumber)
        {
            var request = new HttpRequestMessage(HttpMethod.Get,
                $"https://api.github.com/repos/{owner}/{repo}/pulls/{prNumber}/files");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _httpClient.SendAsync(request);
            var body = await response.Content.ReadAsStringAsync();

            return JsonSerializer.Deserialize<List<GitHubFile>>(body,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                ?? new List<GitHubFile>();
        }
    }
}