using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Config.Helpers;
using Booking.Filters;
using Entities.Models;
using Data;

namespace Booking.Controllers
{

    public class AgesController : Controller
    {
        private readonly BookingDbContext _context;
        private readonly IWebHostEnvironment _host;

        public AgesController(BookingDbContext context, IWebHostEnvironment host)
        {
            _context = context;
            _host = host;
        }

        // GET: Ages
        public async Task<IActionResult> Index(string search, int? page)
        {
            int _page = page ?? 1;
            var ages = from s in _context.Ages.Where(s => !s.IsDelete) select s;
            if (!string.IsNullOrEmpty(search))
            {
                ages = ages.Where(s => s.Name.Contains(search));
            }
            ages = ages.OrderByDescending(s => s.DateCreated).ThenByDescending(s => s.ID);
            var response = await ages.ToPagedList(_page, Configuration.PageSize);
            return View(response);
        }

        // GET: Ages/Create
        public IActionResult Create()
        {


            return PartialView("Create");
        }

        // POST: Ages/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Age age)
        {
            if (ModelState.IsValid)
            {
                try
                {

                    _context.Add(age);
                    await _context.SaveChangesAsync();
                    TempData["Success"] = "Bạn vừa thêm mới dữ liệu thành công";
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception e)
                {
                    Exceptions.LogsExceptions(e, _host.WebRootPath.ToString());
                    TempData["Error"] = "Xin lỗi, có lỗi xảy ra khi thêm mới dữ liệu";
                }
            }
            return PartialView("Create");
        }

        // GET: Ages/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {


            if (id == null)
            {
                return NotFound();
            }

            var age = await _context.Ages.FindAsync(id);
            if (age == null)
            {
                return NotFound();
            }
            return PartialView("Edit", age);
        }

        // POST: Ages/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Age age)
        {
            if (id != age.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(age);
                    await _context.SaveChangesAsync();
                    TempData["Success"] = "Bạn vừa cập nhật dữ liệu thành công";
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception e)
                {
                    Exceptions.LogsExceptions(e, _host.WebRootPath.ToString());
                    TempData["Error"] = "Xin lỗi, có lỗi xảy ra khi cập nhật dữ liệu";
                }
            }
            return PartialView("Edit", age);
        }

        // GET: Ages/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {


            if (id == null)
            {
                return NotFound();
            }

            var age = await _context.Ages.FirstOrDefaultAsync(m => m.ID == id);
            if (age == null)
            {
                return NotFound();
            }

            return PartialView("Delete", age);
        }

        // POST: Ages/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var age = await _context.TempDelete<Age>(s => s.ID == id);
            if (age == null)
            {
                return NotFound();
            }
            await _context.SaveChangesAsync();
            TempData["Success"] = "Bạn vừa xóa dữ liệu thành công";
            return RedirectToAction(nameof(Index));
        }
    }
}
