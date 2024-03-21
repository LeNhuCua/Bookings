
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Services;

namespace Booking.Filters
{
    public class AuthFilter : IAsyncActionFilter
    {
        private readonly string[] allowsPath = { "/login", "/logout", "/api/users/login", "/api/auth/me" };

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var request = context.HttpContext.Request;
            var response = context.HttpContext.Response;
            string requestPath = request.Path;

            bool isRequestPathAllowedToAll = allowsPath.Contains(requestPath.ToLower());

            var dbContext = context.HttpContext.RequestServices.GetService<Data.BookingDbContext>();
            if (dbContext == null)
            {
                throw new NullReferenceException("dbContext is null");
            }
            var currentUser = await JWTHelper.GetCurrentUserFromRequest(dbContext, request);

            // token không hợp lệ và truy cập đường dẫn không được phép
            if (currentUser == null && !isRequestPathAllowedToAll)
            {
                context.Result = new RedirectToRouteResult(new RouteValueDictionary(new
                {
                    controller = "Authentication",
                    action = "SignIn"
                }));
                response.Cookies.Delete(JWTHelper.ACCESS_TOKEN_COOKIE_NAME);
                return;
            }

            // đã đăng nhập thì không thể vào trang login
            if (currentUser != null && requestPath.StartsWith("/login"))
            {
                context.Result = new RedirectToRouteResult(new RouteValueDictionary(new
                {
                    controller = "Home",
                    action = "Index"
                }));
                return;
            }

            // Do something before the action executes.
            await next();
            // Do something after the action executes.
        }
    }
}
