using HomeChatGPT.Configuration;
using HomeChatGPT.Utils;
using Spectre.Console;
using System.Data;
using System.Net;
using System.Text;

Console.OutputEncoding = Encoding.UTF8;
Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

var builder = WebApplication.CreateBuilder(args);

// ��ӡ������E
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
// ���ö˵㣬����Endpoints.FilmHouseEndpoints
app.UseEndpoints(ConfigureEndpoints.FilmHouseEndpoints);
#pragma warning restore ASP0014

app.Run();



void WriteParameterTable()
{
    // ��ȡӦ�ó���汾
    var appVersion = Helper.AppVersion;
    // ����һ�����񣬱�E�ΪFilmHouse.Web��.NET�汾
    var table = new Spectre.Console.Table
    {
        Title = new($"FilmHouse.Web {appVersion} | .NET {Environment.Version}")
    };

    // ��ȡ����ÁE
    var strHostName = Dns.GetHostName();
    // ��ȡ������Ϣ
    var ipEntry = Dns.GetHostEntry(strHostName);
    // ��ȡIP��ַ�б�E
    var ips = ipEntry.AddressList;

    table.AddColumn("Parameter");
    table.AddColumn("Value");
    // ���ӵ�ǰ·��
    table.AddRow(new Spectre.Console.Markup("[blue]Path[/]"), new Spectre.Console.Text(Environment.CurrentDirectory));
    // ���Ӳ���ϵͳ��Ϣ
    table.AddRow(new Spectre.Console.Markup("[blue]System[/]"), new Spectre.Console.Text(Helper.TryGetFullOSVersion()));
    // ���ӵ�ǰ�û���Ϣ
    table.AddRow(new Spectre.Console.Markup("[blue]User[/]"), new Spectre.Console.Text(Environment.UserName));
    // ��������ÁE
    table.AddRow(new Spectre.Console.Markup("[blue]Host[/]"), new Spectre.Console.Text(Environment.MachineName));
    // ����IP��ַ
    table.AddRow(new Spectre.Console.Markup("[blue]IP addresses[/]"), new Spectre.Console.Rows(ips.Select(p => new Spectre.Console.Text(p.ToString()))));
    // ���ӱ༭ƁE
    table.AddRow(new Spectre.Console.Markup("[blue]Editor[/]"), new Spectre.Console.Text(builder.Configuration["Editor"]!));

    AnsiConsole.Write(table);
}