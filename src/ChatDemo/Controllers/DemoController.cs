using Microsoft.AspNetCore.Mvc;

namespace ChatDemo.Controllers
{
    public class DemoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
