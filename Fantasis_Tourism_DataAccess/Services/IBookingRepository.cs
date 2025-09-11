using Fantasis_Tourism_DataAccess.Model;

namespace Fantasis_Tourism_DataAccess.Services
{
    public interface IBookingRepository
    {
        Task<bool> AddAsync(Booking booking);

    }
}
