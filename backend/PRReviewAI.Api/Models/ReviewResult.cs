namespace PRReviewAI.Api.Models
{
    public class ReviewResult
    {
        public string Summary { get; set; } = string.Empty;
        public int Score { get; set; }
        public List<Issue> Issues { get; set; } = new();
    }

    public class Issue
    {
        public string Category { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public int Line { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Suggestion { get; set; } = string.Empty;
    }
}