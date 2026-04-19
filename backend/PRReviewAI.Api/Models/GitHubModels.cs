using System.Text.Json.Serialization;

namespace PRReviewAI.Api.Models
{
    public class GitHubTokenRequest
    {
        public string Code { get; set; } = string.Empty;
    }

    public class GitHubTokenResponse
    {
        public string AccessToken { get; set; } = string.Empty;
    }

    public class GitHubRepo
    {
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("full_name")]
        public string FullName { get; set; } = string.Empty;

        [JsonPropertyName("private")]
        public bool Private { get; set; }
    }

    public class GitHubPR
    {
        public int Number { get; set; }
        public string Title { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;

        [JsonPropertyName("html_url")]
        public string Url { get; set; } = string.Empty;
    }

    public class GitHubFile
    {
        public string Filename { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Patch { get; set; } = string.Empty;
    }

    public class PRReviewResult
    {
        public string Filename { get; set; } = string.Empty;
        public ReviewResult Review { get; set; } = new();
    }
}