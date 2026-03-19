namespace PRReviewAI.Api.Models
{
    public class ReviewRequest
    {
        public string Code { get; set; } = string.Empty;
        public string Language { get; set; } = "javascript";
    }
}