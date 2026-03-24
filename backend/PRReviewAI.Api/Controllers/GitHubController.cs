using Microsoft.AspNetCore.Mvc;
using PRReviewAI.Api.Models;
using PRReviewAI.Api.Services;

namespace PRReviewAI.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GitHubController : ControllerBase
    {
        private readonly GitHubService _gitHubService;
        private readonly OpenAIService _openAIService;

        public GitHubController(GitHubService gitHubService, OpenAIService openAIService)
        {
            _gitHubService = gitHubService;
            _openAIService = openAIService;
        }

        [HttpPost("token")]
        public async Task<IActionResult> GetToken([FromBody] GitHubTokenRequest request)
        {
            var token = await _gitHubService.ExchangeCodeForToken(request.Code);
            if (string.IsNullOrEmpty(token))
                return BadRequest("Failed to exchange code for token");
            return Ok(new GitHubTokenResponse { AccessToken = token });
        }

        [HttpGet("repos")]
        public async Task<IActionResult> GetRepos([FromHeader(Name = "X-GitHub-Token")] string token)
        {
            var repos = await _gitHubService.GetRepos(token);
            return Ok(repos);
        }

        [HttpGet("repos/{owner}/{repo}/pulls")]
        public async Task<IActionResult> GetPullRequests(
            string owner, string repo,
            [FromHeader(Name = "X-GitHub-Token")] string token)
        {
            var prs = await _gitHubService.GetPullRequests(token, owner, repo);
            return Ok(prs);
        }

        [HttpGet("repos/{owner}/{repo}/pulls/{prNumber}/review")]
        public async Task<IActionResult> ReviewPR(
            string owner, string repo, int prNumber,
            [FromHeader(Name = "X-GitHub-Token")] string token)
        {
            var files = await _gitHubService.GetPRFiles(token, owner, repo, prNumber);

            // Only review files with actual changes and skip binary files
            var reviewableFiles = files
                .Where(f => !string.IsNullOrEmpty(f.Patch) && f.Patch.Length < 5000)
                .Take(5) // limit to 5 files to save API costs
                .ToList();

            var results = new List<PRReviewResult>();

            foreach (var file in reviewableFiles)
            {
                var language = GetLanguageFromFilename(file.Filename);
                var review = await _openAIService.ReviewCodeAsync(file.Patch, language);
                results.Add(new PRReviewResult
                {
                    Filename = file.Filename,
                    Review = review
                });
            }

            return Ok(results);
        }

        private string GetLanguageFromFilename(string filename)
        {
            var ext = Path.GetExtension(filename).ToLower();
            return ext switch
            {
                ".js" => "javascript",
                ".ts" => "typescript",
                ".jsx" => "javascript",
                ".tsx" => "typescript",
                ".cs" => "csharp",
                ".py" => "python",
                ".java" => "java",
                ".cpp" or ".cc" => "cpp",
                _ => "plaintext"
            };
        }
    }
}