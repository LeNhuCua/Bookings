
using Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using Booking.Filters;
using Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
string connectionString = builder.Configuration.GetConnectionString("BookingDbContext") ?? "BookingDbContext";
builder.Services.AddDbContext<BookingDbContext>(options => options.UseSqlServer(connectionString,
                                                        sqlServerOptionsAction: sqlOptions =>
                                                        {
                                                            //sqlOptions.EnableRetryOnFailure(
                                                            //    maxRetryCount: 5,
                                                            //    maxRetryDelay: TimeSpan.FromSeconds(5),
                                                            //    errorNumbersToAdd: null);
                                                        }));
// Add services to the container.
builder.Services.AddHttpContextAccessor();
builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add<AuthFilter>();
});
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

string CORS_POLICY_NAME = "AllowAll";
builder.Services.AddCors(options =>
{
    options.AddPolicy(CORS_POLICY_NAME,
        builder =>
        {
            builder
                .WithOrigins("http://localhost:3001", "http://127.0.0.1:3001")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        });
});

// jwt auth services
builder.Services.AddJWTAuthServices(builder);
// business logic services
builder.Services.AddBookingServices();
// Add services to the container.

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors(CORS_POLICY_NAME);

app.UseRouting();
app.UseStatusCodePagesWithReExecute("/NotFound");


app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
