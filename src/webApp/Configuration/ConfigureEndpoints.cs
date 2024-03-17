namespace HomeChatGPT.Configuration
{
    public class ConfigureEndpoints
    {
        public static Action<IEndpointRouteBuilder> FilmHouseEndpoints => endpoints =>
        {
            endpoints.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}/{id?}");
        };
    }
}
