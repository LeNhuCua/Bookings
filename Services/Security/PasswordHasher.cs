using BC = BCrypt.Net.BCrypt;

namespace Services
{
    public class PasswordHasher
    {
        public static string HashPassword(string password)
        {
            return BC.HashPassword(password);
        }

        public static bool ComparePassword(string password, string hashedPassword)
        {
            return BC.Verify(password, hashedPassword);
        }
    }
}
