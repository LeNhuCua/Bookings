using Config.Helpers;

namespace Booking.Models
{
    public class PaginationViewModel
    {
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        public IPaginatedList Results { get; set; }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        public Dictionary<string, object> QueryParams { get; set; } = new Dictionary<string, object>();
        public string? LinkClass { get; set; }
        public string? ControllerName { get; set; }
        public string ActionName { get; set; } = "Index";
    }
}