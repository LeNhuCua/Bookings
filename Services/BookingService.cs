using Services;

namespace Services;

public interface IBookingService
{
    IAuthService authService { get; }

}

public class BookingService : IBookingService
{
    public BookingService(
        IAuthService authService
    )
    {
        this.authService = authService;
    }

    public IAuthService authService { get; }

}
