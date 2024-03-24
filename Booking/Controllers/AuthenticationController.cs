using Microsoft.AspNetCore.Mvc;
using Services;
using Data;

namespace Booking.Controllers
{
    public class AuthenticationController : Controller
    {

        private readonly BookingDbContext _context;
        private readonly IBookingService _bookingService;

        public AuthenticationController(BookingDbContext context, IBookingService bookingService)
        {
            _context = context;
            _bookingService = bookingService;
        }

        // GET: Authentication/SignIn
        // Sign In to Account
        [HttpGet("/login")]
        public IActionResult SignIn()
        {
            return View();
        }

        [HttpPost("/login")]
        public async Task<IActionResult> SignIn(LoginModel creds)
        {
            string? accessToken = await _bookingService.authService.VerifyLoginAndGetToken(creds);

            if (accessToken == null)
            {
                ModelState.AddModelError("", "Email or password is incorrect");
                return View();
            }

            var cookieOptions = _bookingService.authService.GetAccessTokenCookieOptions();
            Response.Cookies.Append(JWTHelper.ACCESS_TOKEN_COOKIE_NAME, accessToken, cookieOptions);

            return RedirectToAction("Index", "Home");
        }

        [HttpGet("/logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete(JWTHelper.ACCESS_TOKEN_COOKIE_NAME);
            return RedirectToAction("SignIn");
        }
    }
}
