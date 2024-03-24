using System;
using System.IO;

namespace Config.Helpers
{
    public class Exceptions
    {
        public static void LogsExceptions(Exception ex, string wwwPath)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
        }
    }
}