using ChatGPT.Net.DTO.ChatGPT;
using HomeChatGPT.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace HomeChatGPT.Controllers
{
    public class HomeController : Controller
    {
        private readonly ChatGptOptions _option;
        private readonly IConfiguration _configuration;
        private readonly string _apiKey;

        public HomeController(IConfiguration configuration, IOptions<ChatGptOptions> options)
        {
            this._configuration = configuration;
            this._option = options.Value;

            var collections = _configuration.AsEnumerable();

            if (collections.Any())
            {
                this._apiKey = collections.ElementAt(0).Value;
            }
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> ChatWithGPT(string input)
        {
            // 调用ChatGPT API
            (string question, string answer) data = await CallChatGPTAPI(input);

            var responseObject = new { question = data.question, answer = data.answer };
            var jsonResponse = JsonConvert.SerializeObject(responseObject);
            return Content(jsonResponse, "application/json");
        }

        [HttpGet]
        public async Task<IActionResult> TryGPT()
        {
            var chatGPTApiClient = new ChatGPTApiClient(this._apiKey, this._option);
            var statusCode = await chatGPTApiClient.TryAskAsync();

            var responseObject = new { statusCode = (int)statusCode };
            return Content(JsonConvert.SerializeObject(responseObject), "application/json");
        }



        private async Task<(string question, string answer)> CallChatGPTAPI(string input)
        {
            var chatGPTApiClient = new ChatGPTApiClient(this._apiKey, this._option);

            string responseData = await chatGPTApiClient.ChatAsync(input);

            string question = input;
            string answer = responseData;

            return (question, answer);
        }
    }
}
