using System.Text;
using System.Text.Json;
using PRReviewAI.Api.Models;

namespace PRReviewAI.Api.Services
{
    public class OpenAIService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public OpenAIService(IConfiguration configuration)
        {
            _httpClient = new HttpClient();
            _apiKey = configuration["OpenAI:ApiKey"] ?? string.Empty;
        }

        public async Task<ReviewResult> ReviewCodeAsync(string code, string language)
        {
            var prompt = BuildPrompt(code, language);

            var requestBody = new
            {
                model = "gpt-4o-mini",
                messages = new[]
                {
                    new
                    {
                        role = "system",
                        content = "You are a senior software engineer performing code reviews. Always respond with valid JSON only, no markdown, no explanation outside the JSON."
                    },
                    new
                    {
                        role = "user",
                        content = prompt
                    }
                },
                temperature = 0.2
            };

            var request = new HttpRequestMessage(HttpMethod.Post,
                "https://api.openai.com/v1/chat/completions");

            request.Headers.Add("Authorization", $"Bearer {_apiKey}");

            request.Content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.SendAsync(request);
            var responseBody = await response.Content.ReadAsStringAsync();

            Console.WriteLine("OpenAI raw response: " + responseBody);

            return ParseResponse(responseBody);
        }

        private string BuildPrompt(string code, string language)
        {
            return $@"Analyze the following {language} code and return ONLY a JSON response.

Return exactly this structure:
{{
  ""summary"": ""one line overall assessment"",
  ""score"": 85,
  ""issues"": [
    {{
      ""category"": ""bug"",
      ""severity"": ""critical"",
      ""line"": 12,
      ""description"": ""what the problem is"",
      ""suggestion"": ""how to fix it""
    }}
  ]
}}

Categories must be one of: bug, security, performance, style
Severity must be one of: critical, warning, suggestion
If no issues found, return empty issues array and score of 100.

Code to review:
````{language}
{code}
```";
        }

        private ReviewResult ParseResponse(string responseBody)
        {
            try
            {
                var doc = JsonDocument.Parse(responseBody);
                var root = doc.RootElement;

                // Check for API errors
                if (root.TryGetProperty("error", out var error))
                {
                    var errorMsg = error.GetProperty("message").GetString();
                    return new ReviewResult
                    {
                        Summary = $"API Error: {errorMsg}",
                        Score = 0
                    };
                }

                // OpenAI response structure
                var text = root
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString() ?? string.Empty;

                Console.WriteLine("OpenAI text: " + text);

                // Clean markdown if present
                text = text.Replace("```json", "").Replace("```", "").Trim();

                var jsonStart = text.IndexOf('{');
                var jsonEnd = text.LastIndexOf('}');

                if (jsonStart >= 0 && jsonEnd >= 0)
                {
                    var jsonString = text.Substring(jsonStart, jsonEnd - jsonStart + 1);
                    return JsonSerializer.Deserialize<ReviewResult>(jsonString,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                        ?? new ReviewResult { Summary = "Could not parse response", Score = 0 };
                }

                return new ReviewResult { Summary = "Invalid response format", Score = 0 };
            }
            catch (Exception ex)
            {
                Console.WriteLine("Parse error: " + ex.Message);
                Console.WriteLine("Full response: " + responseBody);
                return new ReviewResult
                {
                    Summary = $"Error: {ex.Message}",
                    Score = 0
                };
            }
        }
    }
}


