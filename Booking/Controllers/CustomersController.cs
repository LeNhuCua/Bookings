using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Config.Helpers;
using Entities.Models;
using Data;
using Microsoft.AspNetCore.Mvc.Rendering;
using Booking.Filters;
using Services;

namespace Booking.Controllers
{

  public class CustomersController : BaseController
  {
    public CustomersController(BookingDbContext context, IBookingService bookingService, IWebHostEnvironment host, IConfiguration configuration) : base(context, bookingService, host, configuration)
    {
    }
    // GET: Customers
    public async Task<IActionResult> Index(string search, int? page)
    {
      var currentUser = await _bookingService.authService.GetCurrentUser();
      // var infoCurrentUser = _context.Users.FirstOrDefaultAsync(s => s.ID == new int(currentUser!.Id!));
      var customers = _context.Customers.Where(s => !s.IsDelete);
      if (!currentUser!.IsRoot)
      {
        customers = customers.Where(s => s.CreatedBy == currentUser!.ID)
            .Include(s => s.CustomerType)
            .Include(s => s.Bookings.Where(b => b.Status != BookingStatus.CANCELED))

            .AsNoTracking();
      }
      else
      {
        customers = customers.Include(s => s.CustomerType)

            .Include(s => s.Bookings.Where(b => b.Status != BookingStatus.CANCELED))

            .AsNoTracking();
      }

      if (!string.IsNullOrEmpty(search))
      {
        customers = customers.Where(s => s.LastName.Contains(search)
            || s.FirstMidName.Contains(search)
            || s.Code.Contains(search)
            || s.Phone.Contains(search)
        );
      }

      customers = customers.OrderByDescending(s => s.Status).ThenByDescending(s => s.DateCreated).ThenByDescending(s => s.ID);
      var response = await customers.ToPagedList(page ?? 1, Configuration.PageSize);
      return View(response);
    }

    // GET: Customers/Create
    public async Task<IActionResult> Create()
    {

      var provinces = await _context.Provinces.AsNoTracking().ToListAsync();
      var customerTypes = await _context.CustomerTypes.Where(s => !s.IsDelete).AsNoTracking().ToListAsync();
      var code = await _context.GetNextStringID<Customer>(s => s.Code, "KH", 8);

      var vocatives = Configuration.Vocative();
      var genders = Configuration.Gender();

      return Ok(new
      {
        provinces,
        customerTypes,
        code,
        vocatives,
        genders
      });
    }

    // POST: Customers/Create
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Customer customer)
    {
      {
        try
        {
          customer.Code = await _context.GetNextStringID<Customer>(s => s.Code, "KH", 8);
          _context.Add(customer);
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
      return RedirectToAction(nameof(Index));
    }

    // GET: Customers/Edit/5
    public async Task<IActionResult> Edit(int? id)
    {

      if (id == null)
      {
        return NotFound();
      }

      var customer = await _context.Customers.FindAsync(id);
      if (customer == null)
      {
        return NotFound();
      }

      var provinces = await _context.Provinces.AsNoTracking().ToListAsync();
      var customerTypes = await _context.CustomerTypes.Where(s => !s.IsDelete).AsNoTracking().ToListAsync();

      var vocatives = Configuration.Vocative();
      var genders = Configuration.Gender();
      return Ok(new
      {

        customer,
        provinces,
        customerTypes,

        vocatives,
        genders
      });
    }

    // POST: Customers/Edit/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int? id, Customer customer)
    {
      if (id == null)
      {
        return NotFound();
      }
      try
      {
        _context.Update(customer);
        await _context.SaveChangesAsync();
        TempData["Success"] = "Bạn vừa cập nhật dữ liệu thành công";
        return RedirectToAction(nameof(Index));
      }
      catch (Exception e)
      {
        Exceptions.LogsExceptions(e, _host.WebRootPath.ToString());
        TempData["Error"] = "Xin lỗi, có lỗi xảy ra khi cập nhật dữ liệu";
      }

      return RedirectToAction(nameof(Index));
    }

    public async Task<IActionResult> Details(int? id)
    {
      if (id == null)
      {
        return NotFound();
      }

      var currentUser = await _bookingService.authService.GetCurrentUser();
      var customer = await _context.Customers.Where(s => s.ID == id)
          .Include(s => s.Bookings).FirstOrDefaultAsync();
      if (customer == null)
      {
        return NotFound();
      }

      return Ok(new { customer });
    }

    // GET: Customers/Delete/5
    public async Task<IActionResult> Delete(int? id)
    {

      if (id == null)
      {
        return NotFound();
      }

      var customer = await _context.Customers.FirstOrDefaultAsync(m => m.ID == id);
      if (customer == null)
      {
        return NotFound();
      }

      return PartialView("Delete", customer);
    }

    // POST: Customers/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
      var customer = await _context.TempDelete<Customer>(s => s.ID == id);
      if (customer == null)
      {
        return NotFound();
      }
      await _context.SaveChangesAsync();
      TempData["Success"] = "Bạn vừa xóa dữ liệu thành công";
      return RedirectToAction(nameof(Index));
    }

    //Get: Customers/ListBookings/id
    public async Task<IActionResult> ListBookings(int? id)
    {
      if (id == null)
      {
        return NotFound();
      }

      var bookings = await _context.Bookings.Where(s => s.CustomerID == id).ToListAsync();
      if (bookings.Count <= 0)
      {
        return NotFound();
      }

      return Ok(new
      {
        bookings,
      });
    }
  }
}
