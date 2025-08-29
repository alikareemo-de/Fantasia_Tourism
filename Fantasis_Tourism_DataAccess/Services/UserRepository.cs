using Fantasis_Tourism_DataAccess.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Fantasis_Tourism_DataAccess.Services
{
    public class UserRepository : IUserRepository
    {
        private readonly Fantasis_TourismDbContext _context;
        private readonly ILogger<UserRepository> _logger;

        public UserRepository(Fantasis_TourismDbContext context, ILogger<UserRepository> logger)
        {
            _context = context;
            _logger = logger;
        }



        public async Task<Users?> GetByIdAsync(string id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<List<Users>> GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task AddAsync(Users user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> UpdateAsync(Users user)
        {
            try
            {
                var userinfo = await _context.Users.FindAsync(user.Id);
                if (userinfo == null)
                    return false;

                if (!string.IsNullOrEmpty(user.Username))
                    userinfo.Username = user.Username;

                if (!string.IsNullOrEmpty(user.FirstName))
                    userinfo.FirstName = user.FirstName;

                if (!string.IsNullOrEmpty(user.LastName))
                    userinfo.LastName = user.LastName;

                if (!string.IsNullOrEmpty(user.Email))
                    userinfo.Email = user.Email;

                if (!string.IsNullOrEmpty(user.Password))
                    userinfo.Password = user.Password;

                if (!string.IsNullOrEmpty(user.CellPhoneNumber))
                    userinfo.CellPhoneNumber = user.CellPhoneNumber;

                if (!string.IsNullOrEmpty(user.Dateofbirth))
                    userinfo.Dateofbirth = user.Dateofbirth;

                if (!string.IsNullOrEmpty(user.country))
                    userinfo.country = user.country;

                if (!string.IsNullOrEmpty(user.city))
                    userinfo.city = user.city;

                if (!string.IsNullOrEmpty(user.Address))
                    userinfo.Address = user.Address;

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while updating user");
                return false;
            }
        }

        public async Task DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }
    }
}
