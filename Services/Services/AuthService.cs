using System.Security.Claims;
using Data;
using Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.Mvc;

namespace Services;
public interface IAuthService
{
    string CreateToken(ClaimsIdentity subject);
    Task<User?> GetCurrentUser();
    CookieOptions GetAccessTokenCookieOptions();

    UserClaimsModel GetUserFromToken();
    Task<string?> VerifyLoginAndGetToken(LoginModel creds);

}

public class AuthService : IAuthService
{
    private readonly BookingDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IConfiguration _configuration;

    public AuthService(BookingDbContext context, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
        _configuration = configuration;
    }

    public UserClaimsModel GetUserFromToken()
    {
        return JWTHelper.DecodeClaims(_httpContextAccessor.HttpContext?.User);
    }

    public string CreateToken(ClaimsIdentity subject)
    {
        return JWTHelper.GenerateToken(_configuration, subject);
    }

    public CookieOptions GetAccessTokenCookieOptions()
    {
        return JWTHelper.GetAccessTokenCookieOptions();
    }


    public async Task<User?> GetCurrentUser()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null)
        {
            return null;
        }
        var user = await JWTHelper.GetCurrentUserFromRequest(_context, httpContext.Request);
        return user;
    }

    public async Task<string?> VerifyLoginAndGetToken(LoginModel creds)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == creds.Email && u.Status && !u.IsDelete);
        if (user == null || !PasswordHasher.ComparePassword(creds.Password ?? "", user.Password))
        {
            return null;
        }

        var subject = new ClaimsIdentity(new[]
            {
                new Claim("id", user.ID.ToString()),
                new Claim("fullName", user.FullName),
                new Claim("avatar", user.AvatarUrl),
                new Claim("phone", user.Phone),
                new Claim(ClaimTypes.NameIdentifier, user.Email),
                new Claim(ClaimTypes.Role, user.IsRoot ? "admin" : "user"),
            }
        );


        return CreateToken(subject);
    }


}
