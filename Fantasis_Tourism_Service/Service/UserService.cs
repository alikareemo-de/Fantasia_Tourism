using Fantasis_Tourism_DataAccess.Model;
using Fantasis_Tourism_DataAccess.Services;
using Microsoft.Extensions.Logging;

namespace Fantasis_Tourism_Service.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<UserService> _logger;

        public UserService(IUserRepository userRepository, ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _logger = logger;
        }

        private string CombinePasswordAndUsername(string password, string username)
        {
            return password + "{" + username + "}";
        }

        private string HashPassword(string password, string username)
        {
            var combined = CombinePasswordAndUsername(password, username);
            return BCrypt.Net.BCrypt.HashPassword(combined);
        }


        private bool VerifyPassword(string password, string username, string storedHash)
        {
            var combined = CombinePasswordAndUsername(password, username);
            return BCrypt.Net.BCrypt.Verify(combined, storedHash);
        }

        public async Task<Users?> GetUserByIdAsync(string id)
        {

            var user = await _userRepository.GetByIdAsync(id);

            if (user == null) return null;

            return new Users
            {
                Id = user.Id,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                CellPhoneNumber = user.CellPhoneNumber,
                Dateofbirth = user.Dateofbirth,
                country = user.country,
                city = user.city,
                Address = user.Address,
                PaymentMethods = user.PaymentMethods.Select(pm => new PaymentMethod
                {
                    Id = pm.Id,
                    CardNumber = $"{pm.CardNumber[0]}*** **** **** {pm.CardNumber.Substring(pm.CardNumber.Length - 4)}",

                    ExpiryDate = pm.ExpiryDate,
                    CardholderName = pm.CardholderName,
                    BillingAddress = pm.BillingAddress,
                    City = pm.City,
                    State = pm.State,
                    ZipCode = pm.ZipCode,
                    Country = pm.Country
                }).ToList()
            };
        }

        public async Task<List<Users>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task AddUserAsync(Users user)
        {
            user.Password = HashPassword(user.Password, user.Username);
            await _userRepository.AddAsync(user);
        }

        public async Task<bool> UpdateUserAsync(Users user)
        {
            try
            {
                if (!string.IsNullOrEmpty(user.Password) && !user.Password.StartsWith("$2a$"))
                {
                    user.Password = HashPassword(user.Password, user.Username);
                }

                var update = await _userRepository.UpdateAsync(user);
                if (update) return true;
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return false;
            }
        }

        public async Task DeleteUserAsync(int id)
        {
            await _userRepository.DeleteAsync(id);
        }

        public async Task<Users?> AuthenticateAsync(string username, string password)
        {
            var allUsers = await _userRepository.GetAllAsync();
            var user = allUsers.FirstOrDefault(u => u.Username == username);

            if (user == null)
                return null;

            bool passwordMatches = VerifyPassword(password, username, user.Password);
            if (!passwordMatches)
                return null;

            return user;
        }

        public async Task<bool> AddOrUpdatePaymentMethodAsync(PaymentMethodDto paymentMethod)
        {
            try
            {
                PaymentMethod method = new PaymentMethod
                {
                    Id = paymentMethod.Id,
                    UserId = paymentMethod.UserId,
                    CardholderName = paymentMethod.CardholderName,
                    CardNumber = paymentMethod.CardNumber,
                    City = paymentMethod.City,
                    State = paymentMethod.State,
                    Country = paymentMethod.Country,
                    BillingAddress = paymentMethod.BillingAddress,
                    ExpiryDate = paymentMethod.ExpiryDate,
                    ZipCode = paymentMethod.ZipCode
                };
                var result = await _userRepository.UpsertPaymentMethod(method);
                if (result)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return false;
            }
        }

        public async Task<bool> CheckUserinfo(string userId)
        {
            return await _userRepository.CheckUserinfo(userId);
        }

    }
}
