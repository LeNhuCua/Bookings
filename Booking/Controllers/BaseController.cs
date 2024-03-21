using Microsoft.AspNetCore.Mvc;
using Data;
using Services;

namespace Booking.Controllers;

public class BaseController : Controller
{
    protected readonly BookingDbContext _context;
    protected readonly IBookingService _bookingService;
    protected readonly IWebHostEnvironment _host;
    protected readonly IConfiguration _configuration;

    public BaseController(BookingDbContext context, IBookingService bookingService, IWebHostEnvironment host, IConfiguration configuration)
    {
        _context = context;
        _bookingService = bookingService;
        _host = host;
        _configuration = configuration;
    }
}