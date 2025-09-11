using Fantasis_Tourism_DataAccess.Model;

namespace Fantasis_Tourism_Service.Service
{
    public interface IUserService
    {
        Task<Users?> GetUserByIdAsync(string id);
        Task<List<Users>> GetAllUsersAsync();
        Task AddUserAsync(Users user);
        Task<bool> UpdateUserAsync(Users user);
        Task DeleteUserAsync(int id);
        Task<Users?> AuthenticateAsync(string username, string password);
        Task<bool> AddOrUpdatePaymentMethodAsync(PaymentMethodDto paymentMethod);

        Task<bool> CheckUserinfo(string userId);


    }
}
