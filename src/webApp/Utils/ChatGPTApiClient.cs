using ChatGPT.Net;
using ChatGPT.Net.DTO.ChatGPT;
using System.Net;

namespace HomeChatGPT.Utils
{
    public class ChatGPTApiClient
    {
        private readonly string _apiKey;
        private readonly ChatGptOptions _chatGptOptions;

        public ChatGPTApiClient(string apiKey, ChatGptOptions chatGptOptions)
        {
            this._apiKey = apiKey;
            this._chatGptOptions = chatGptOptions;
        }

        public async Task<string> ChatAsync(string message)
        {
            var bot = new ChatGpt(this._apiKey, this._chatGptOptions);
            return await bot.Ask(message);
        }

        public async Task<HttpStatusCode> TryAskAsync()
        {
            var bot = new ChatGpt(this._apiKey, this._chatGptOptions);
            return await bot.TryAsk();
        }
    }
}
