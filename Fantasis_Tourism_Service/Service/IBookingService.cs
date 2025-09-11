using Fantasis_Tourism_DataAccess.Model;

namespace Fantasis_Tourism_Service.Service
{
    public interface IBookingService
    {
        Task<bool> AddAsync(BookingRequest request);
    }
}
