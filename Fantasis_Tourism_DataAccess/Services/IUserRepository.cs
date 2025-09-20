using Fantasis_Tourism_DataAccess.Model;

namespace Fantasis_Tourism_DataAccess.Services
{
    public interface IUserRepository
    {
        Task<Users?> GetByIdAsync(string id);
        Task<List<Users>> GetAllAsync();
        Task AddAsync(Users user);
        Task<bool> UpdateAsync(Users user);
        Task DeleteAsync(int id);
        Task<bool> CheckUserinfo(string userId);
        Task<PaymentMethod> Getpaymentinfo(string userId);
        Task<bool> UpsertPaymentMethod(PaymentMethod paymentMethod);
    }
}
