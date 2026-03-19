using Microsoft.AspNetCore.Mvc;
using PRReviewAI.Api.Models;
using PRReviewAI.Api.Services;

namespace PRReviewAI.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly OpenAIService _openAIService;

        public ReviewController(OpenAIService openAIService)
        {
            _openAIService = openAIService;
        }

        [HttpPost]
        public async Task<IActionResult> Review([FromBody] ReviewRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Code))
                return BadRequest("Code cannot be empty");

            if (request.Code.Length > 10000)
                return BadRequest("Code too long. Maximum 10000 characters");

            var result = await _openAIService.ReviewCodeAsync(request.Code, request.Language);
            return Ok(result);
        }
    }
}