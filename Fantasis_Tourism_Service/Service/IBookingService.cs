using Fantasis_Tourism_DataAccess.Model;

namespace Fantasis_Tourism_Service.Service
{
    public interface IBookingService
    {
        Task<bool> AddAsync(BookingRequest request);
        Task<List<RequestsDto>> GetUserRequest(string userId);
        Task<List<RequestsDto>> GetRequestForUser(string hostId);
        Task<bool> RejectRequest(string requestId);
        Task<bool> CancelRequest(string requestId);
    }
}
