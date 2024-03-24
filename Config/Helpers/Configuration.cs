using System;
using System.Linq;
using System.Collections.Generic;
using Entities.Models;

namespace Config.Helpers
{


  public class Configuration
  {
    public const int PageSize = 10;
    public const int MaxPageSize = 1000;
    public const int ShowMaxPages = 10;




    public static Dictionary<int, string> Gender()
    {
      Dictionary<int, string> listGenders = new()
            {
                { 0, "Không xác định" },
                { 1, "Nam" },
                { 2, "Nữ" }
            };
      return listGenders;
    }

    public static Dictionary<string, string> Vocative()
    {
      Dictionary<string, string> listVocatives = new()
            {
                { "Ông", "Ông" },
                { "Bà", "Bà" },
                { "Cô", "Cô" },
                { "Bác", "Bác" },
                { "Chú", "Chú" },
                { "Anh", "Anh" },
                { "Chị", "Chị" }
            };
      return listVocatives;
    }

  }
}

