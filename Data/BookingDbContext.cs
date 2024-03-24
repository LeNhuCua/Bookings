using Microsoft.EntityFrameworkCore;
using System.Reflection;
using Microsoft.AspNetCore.Http;
using Entities.Models;
using Entities.BaseEntities;


namespace Data
{
  public class BookingDbContext : DbContext
  {
    private readonly IHttpContextAccessor _httpContextAccessor;
    public BookingDbContext(DbContextOptions<BookingDbContext> options, IHttpContextAccessor accessor) : base(options)
    {
      _httpContextAccessor = accessor;
    }

    public DbSet<Age> Ages { get; set; }

    public DbSet<Province> Provinces { get; set; }

    public DbSet<User> Users { get; set; }

    public DbSet<CustomerType> CustomerTypes { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Booking> Bookings { get; set; }



    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
      var entries = ChangeTracker.Entries()
          .Where(e => e.Entity is BaseEntity && (e.State == EntityState.Added || e.State == EntityState.Modified || e.State == EntityState.Deleted));
      var currentUserID = "1";
      if (_httpContextAccessor.HttpContext != null)
      {
        // Truy cập HttpContext ở đây
        currentUserID = _httpContextAccessor.HttpContext.User.Claims?.FirstOrDefault(x => x.Type == "id")?.Value;
      }

      foreach (var entry in entries)
      {
        var entity = (BaseEntity)entry.Entity;
        switch (entry.State)
        {
          case EntityState.Modified:
            base.Entry(entity).Property(s => s.DateCreated).IsModified = false;
            base.Entry(entity).Property(s => s.CreatedBy).IsModified = false;
            if (entity.IsDelete)
            {
              entity.DateDeleted = DateTime.Now;
              entity.DeletedBy = int.Parse(currentUserID ?? "1");
              break;
            }
            // set
            entity.LastUpdated = DateTime.Now;
            entity.UpdatedBy = int.Parse(currentUserID ?? "1");

            break;
          case EntityState.Added:
            entity.DateCreated = DateTime.Now;
            entity.LastUpdated = DateTime.Now;
            entity.IsDelete = false;
            entity.UpdatedBy = int.Parse(currentUserID ?? "1");
            entity.CreatedBy = int.Parse(currentUserID ?? "1");

            break;
          case EntityState.Deleted:
            entity.DateDeleted = DateTime.Now;
            entity.DeletedBy = int.Parse(currentUserID ?? "1");
            break;
        }

      }
      return await base.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);
      foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
      {
        relationship.DeleteBehavior = DeleteBehavior.Restrict;
      }

      modelBuilder.Entity<User>().HasData(
       new User()
       {
         ID = 1,
         FullName = "Lê Như Của",
         Gender = 1,
         IsRoot = true,
         Phone = "0123466745",
         Address = "Nha Trang",
         Status = true,
         Email = "cualn@gmail.com",
         Password = "$2a$11$fDLEpvR3MpETZY0Ds7pL1eUedm.WwL9AM.Ihs6MPoijnHsbUK6zVe", // 1234567
         Avatar = "Avatar",

       }
   );

    }

    /// <summary>
    /// Thêm mới hoặc cập nhật
    /// </summary>
    public async Task Upsert<T>(
        System.Linq.Expressions.Expression<Func<T, bool>> predicate,
        T entity,
        bool isUpdate = false
    ) where T : class
    {
      var exist = await base.Set<T>().AnyAsync(predicate);
      if (exist)
      {
        base.Update(entity);
        return;
      }
      base.Add(entity);
    }

    // TODO: rename to SoftDelete
    /// <summary>Soft delete an entity.
    /// THIS METHOD DOES NOT SAVE FOR YOU
    /// </summary>
    public async Task<T> TempDelete<T>(
        System.Linq.Expressions.Expression<Func<T, bool>> predicate
    ) where T : BaseEntity
    {
      var _entity = await base.Set<T>().FirstOrDefaultAsync(predicate);
      if (_entity == null)
      {
        return null;
      }
      _entity.IsDelete = true;
      base.Update(_entity);
      return _entity;
    }

    public async Task<IEnumerable<T>> TempDeleteList<T>(
     System.Linq.Expressions.Expression<Func<T, bool>> predicate
        ) where T : BaseEntity
    {
      var entitiesToDelete = await base.Set<T>().Where(predicate).ToListAsync();

      foreach (var entity in entitiesToDelete)
      {
        entity.IsDelete = true;
        base.Update(entity);
      }

      return entitiesToDelete;
    }



    /// <summary>Soft delete multiple entities.
    /// THIS METHOD DOES NOT SAVE FOR YOU
    /// </summary>
    public async Task<IEnumerable<T>> SoftDeleteRange<T>(
        System.Linq.Expressions.Expression<Func<T, bool>> predicate
    ) where T : BaseEntity
    {
      var _entities = await base.Set<T>().Where(predicate).ToListAsync();
      if (_entities.Count == 0)
      {
        return Enumerable.Empty<T>();
      }
      foreach (var entity in _entities)
      {
        entity.IsDelete = true;
      }

      base.UpdateRange(_entities);
      return _entities;
    }

    /// <summary>Partial update (chỉ update những thuộc tính được chọn)</summary>
    /// <example>
    /// Chỉ update Name và Title từ myEntity
    /// PartialUpdate(myEntity, new () {
    ///    s => s.Name,
    ///    s => s.Title,
    /// })
    /// </example>
    public T PartialUpdate<T>(
        T entity,
        List<System.Linq.Expressions.Expression<Func<T, object>>> expressions
    ) where T : class
    {
      base.Entry(entity).State = EntityState.Unchanged;
      foreach (var expression in expressions)
      {
        base.Entry(entity).Property(expression).IsModified = true;
      }
      return entity;
    }



        /// <summary>
        /// Lấy ID tiếp theo từ chuỗi (DH00000123)
        /// </summary>
        /* ví dụ: string nextID = await context.GetNextStringID<Booking>(s => s.Code, "DH", 8); */
        /* trả về DH00000005 */
        public async Task<string> GetNextStringID<T>(
            System.Linq.Expressions.Expression<Func<T, string>> selector,
            string prefix,
            int lenght
        ) where T : BaseEntity
        {
            long? lastID = await base.Set<T>()
                .IgnoreQueryFilters()
                .Select(selector)
                .Where(s => s.StartsWith(prefix))
                .MaxAsync(s => ((long?)Convert.ToInt64(s.Replace(prefix, ""))));

            long nextID = (lastID ?? 0) + 1;
            return $"{prefix}{nextID.ToString($"D{lenght}")}";
        }



  }


  public static class EFFilterExtensions
  {
    public static void ApplyGlobalFilter(this ModelBuilder modelBuilder, Type entityType)
    {
      ApplyGlobalFilterMethod.MakeGenericMethod(entityType)
          .Invoke(null, new object[] { modelBuilder });
    }

    static readonly MethodInfo ApplyGlobalFilterMethod = typeof(EFFilterExtensions)
               .GetMethods(BindingFlags.Public | BindingFlags.Static)
               .Single(t => t.IsGenericMethod && t.Name == "ApplyGlobalFilter");

  }
}