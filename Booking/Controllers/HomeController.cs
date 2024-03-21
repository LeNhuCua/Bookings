using Booking.Models;
using Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Services;
using System.Diagnostics;

namespace Booking.Controllers
{
  public class HomeController : BaseController
  {
    public HomeController(BookingDbContext context, IBookingService bookingService, IWebHostEnvironment host, IConfiguration configuration) : base(context, bookingService, host, configuration)
    {

    }

      public async Task<IActionResult> Index()
        {

            var users = from s in _context.Users.Where(s => !s.IsDelete)
                         select s;

            users = users.OrderBy(s => s.FullName).ThenBy(s => s.ID);

            return View(await users.ToListAsync());
        }

    public IActionResult Privacy()
    {
      return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
      return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
  }
}