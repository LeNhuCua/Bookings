using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Config.Helpers
{
    public class ParseQueryStringToDictionary
    {
        public static Dictionary<string, object> Parse(HttpRequest request)
        {
            string queryString = request.QueryString.Value;
            var _dict = new Dictionary<string, object>();
            var queryDict = QueryHelpers.ParseQuery(queryString);
            foreach (var key in queryDict.Keys)
            {
                _dict[key] = queryDict[key];
            }
            return _dict;
        }
    }
}
