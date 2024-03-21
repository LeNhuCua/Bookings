using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Data;
using Entities.Models;

namespace Services
{
    public class JWTHelper
    {
        public static readonly string ACCESS_TOKEN_COOKIE_NAME = "access-token";

        public static string GenerateToken(IConfiguration configuration, ClaimsIdentity subject)
        {
            DateTime TokenExpirationTime = DateTime.UtcNow.AddDays(3).Date;
            var issuer = configuration["Jwt:Issuer"];
            var audience = configuration["Jwt:Audience"];
            var key = Encoding.ASCII.GetBytes(configuration["Jwt:Key"] ?? "serect");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = subject,
                Expires = TokenExpirationTime,
                Issuer = issuer,
                Audience = audience,
                // SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.Aes128CbcHmacSha256),

            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public static async Task<User?> GetCurrentUserFromRequest(BookingDbContext context, HttpRequest request)
        {
            bool isAuthenticated = request.HttpContext.User.Identity?.IsAuthenticated ?? false;

            var claims = request.HttpContext.User;
            var emailClaim = claims.FindFirst(ClaimTypes.NameIdentifier);
            if (emailClaim == null || !isAuthenticated)
            {
                return null;
            }

            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == emailClaim.Value && u.Status && !u.IsDelete);
            return user;
        }

        public static CookieOptions GetAccessTokenCookieOptions(bool isSecure = false)
        {
            return new()
            {
                Secure = isSecure,
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Path = "/",
                Expires = DateTime.Now.AddMonths(1),
            };
        }

        public static UserClaimsModel DecodeClaims(ClaimsPrincipal? claims)
        {
            return new() {
                Id = claims?.FindFirstValue("id"),
                Email = claims?.FindFirstValue(ClaimTypes.NameIdentifier),
                FullName = claims?.FindFirstValue("fullName"),
                Avatar = claims?.FindFirstValue("avatar"),
            };
        }
    }
}
