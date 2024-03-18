﻿using HomeChatGPT.Utils;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace HomeChatGPT.Controllers
{
    public class HomeController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly string _apiKey;

        public HomeController(IConfiguration configuration)
        {
            this._configuration = configuration;

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
            // 将对象序列化为JSON字符串
            string jsonResponse = JsonConvert.SerializeObject(responseObject);

            // 返回JSON响应
            return Content(jsonResponse, "application/json");
        }

        private async Task<(string question, string answer)> CallChatGPTAPI(string input)
        {
            var chatGPTApiClient = new ChatGPTApiClient(this._apiKey);

            string responseData = await chatGPTApiClient.ChatAsync(input);
            //Console.WriteLine(responseData);

            string question = input;
            string answer = responseData;

            return (question, answer);
        }
    }
}