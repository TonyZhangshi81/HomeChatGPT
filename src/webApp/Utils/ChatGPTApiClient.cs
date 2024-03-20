using ChatGPT.Net;
using System.Net;

namespace HomeChatGPT.Utils
{
    public class ChatGPTApiClient
    {
        private readonly string _apiKey;

        public ChatGPTApiClient(string apiKey)
        {
            _apiKey = apiKey;
        }

        public async Task<string> ChatAsync(string message)
        {
            var bot = new ChatGpt(this._apiKey);
            return await bot.Ask(message);
        }

        public async Task<HttpStatusCode> TryAskAsync()
        {
            var bot = new ChatGpt(this._apiKey);
            return await bot.TryAsk();
        }
    }
}
