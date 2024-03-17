#nullable disable
using ChatGPT.Net;
using Newtonsoft.Json;
using System.Text;

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
            //Console.WriteLine(response);

            /*
            // ChatGPT 3.5 API端点
            string endpoint = "https://api.openai.com/v1/completions";

            // 请求内容，您可以根据您的需求进行修改
            string prompt = message;
            int maxTokens = 2048;
            double temperature = 0.5;

            // 准备请求数据
            var requestData = new
            {
                model = "gpt-3.5-turbo-0613",
                //prompt = prompt,
                max_tokens = maxTokens,
                temperature = temperature,
                messages = new[]
                {
                    new
                    {
                        role = "user", content = message
                    }
                }
            };

            try
            {
                // 发送HTTP POST请求
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");

                    var content = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(requestData), Encoding.UTF8, "application/json");

                    var response = await client.PostAsync(endpoint, content);
                    var responseContenta = await response.Content.ReadAsStringAsync();

                    if (response.IsSuccessStatusCode)
                    {
                        var responseContent = await response.Content.ReadAsStringAsync();
                        dynamic jsonResponse = JsonConvert.DeserializeObject(responseContent);

                        Console.WriteLine(responseContent);
                        return jsonResponse.choices[0].text;
                    }
                    else
                    {
                        Console.WriteLine($"Error: {response.StatusCode}");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
            */
            return response;
        }
    }
}
