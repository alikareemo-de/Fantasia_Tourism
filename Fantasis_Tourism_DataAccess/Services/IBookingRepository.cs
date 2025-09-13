using Fantasis_Tourism_DataAccess.Model;

namespace Fantasis_Tourism_DataAccess.Services
{
    public interface IBookingRepository
    {
        Task<bool> AddAsync(Booking booking);
        Task<Booking> GetRequestById(Guid requestId);
        Task<List<Booking>> GetUserRequest(string userId);
        Task<List<Booking>> GetRequestForUser(string hostId);
        Task<bool> RejectRequest(Guid requestId);
        Task<bool> CancelRequest(Guid requestId);
    }
}
