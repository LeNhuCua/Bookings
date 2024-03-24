using Microsoft.AspNetCore.Mvc;
using Config.Helpers;
using Booking.Models;

namespace Booking.Components
{
    public class Pagination : ViewComponent
    {
        public Task<IViewComponentResult> InvokeAsync(IPaginatedList listData)
        {
            return Task.FromResult((IViewComponentResult)View("Pagination", new PaginationViewModel() { Results = listData }));
        }
    }

    /// <summary>
    /// New pagination component
    /// </summary>
    [ViewComponent(Name = "Pagination")]
    public class NextPagination : ViewComponent
    {
        public Task<IViewComponentResult> InvokeAsync(PaginationViewModel model)
        {
            return Task.FromResult((IViewComponentResult)View("Pagination", model));
        }
    }
}
