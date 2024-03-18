using ChatGPT.Net;

namespace HomeChatGPT.Utils
{
    public class ChatGPTApiClient
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public ChatGPTApiClient(string apiKey)
        {
            _httpClient = new HttpClient();
            _apiKey = apiKey;
        }

        public async Task<string> ChatAsync(string message)
        {
            var bot = new ChatGpt(this._apiKey);

            var response = await bot.Ask(message);

            return response;
        }
    }
}
