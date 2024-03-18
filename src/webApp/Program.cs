using HomeChatGPT.Configuration;
using HomeChatGPT.Utils;
using Spectre.Console;
using System.Data;
using System.Net;
using System.Text;

Console.OutputEncoding = Encoding.UTF8;
Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

var builder = WebApplication.CreateBuilder(args);

// 打印参数眮E
WriteParameterTable();

// Add services to the container.
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

#pragma warning disable ASP0014
// 配置端点，配置Endpoints.FilmHouseEndpoints
app.UseEndpoints(ConfigureEndpoints.FilmHouseEndpoints);
#pragma warning restore ASP0014

app.Run();



void WriteParameterTable()
{
    // 获取应用程序版本
    var appVersion = Helper.AppVersion;
    // 创建一个柄择，眮E馕狥ilmHouse.Web和.NET版本
    var table = new Spectre.Console.Table
    {
        Title = new($"FilmHouse.Web {appVersion} | .NET {Environment.Version}")
    };

    // 获取主机脕E
    var strHostName = Dns.GetHostName();
    // 获取主机信息
    var ipEntry = Dns.GetHostEntry(strHostName);
    // 获取IP地址列眮E
    var ips = ipEntry.AddressList;

    table.AddColumn("Parameter");
    table.AddColumn("Value");
    // 铁赜当前路径
    table.AddRow(new Spectre.Console.Markup("[blue]Path[/]"), new Spectre.Console.Text(Environment.CurrentDirectory));
    // 铁赜操作系统信息
    table.AddRow(new Spectre.Console.Markup("[blue]System[/]"), new Spectre.Console.Text(Helper.TryGetFullOSVersion()));
    // 铁赜当前用户信息
    table.AddRow(new Spectre.Console.Markup("[blue]User[/]"), new Spectre.Console.Text(Environment.UserName));
    // 铁赜主机脕E
    table.AddRow(new Spectre.Console.Markup("[blue]Host[/]"), new Spectre.Console.Text(Environment.MachineName));
    // 铁赜IP地址
    table.AddRow(new Spectre.Console.Markup("[blue]IP addresses[/]"), new Spectre.Console.Rows(ips.Select(p => new Spectre.Console.Text(p.ToString()))));
    // 铁赜编辑苼E
    table.AddRow(new Spectre.Console.Markup("[blue]Editor[/]"), new Spectre.Console.Text(builder.Configuration["Editor"]!));

    AnsiConsole.Write(table);
}