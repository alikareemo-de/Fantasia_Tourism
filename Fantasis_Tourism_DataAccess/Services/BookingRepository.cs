using Fantasis_Tourism_DataAccess.Enums;
using Fantasis_Tourism_DataAccess.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Fantasis_Tourism_DataAccess.Services
{
    public class BookingRepository : IBookingRepository
    {
        private readonly Fantasis_TourismDbContext _context;
        private readonly ILogger<BookingRepository> _logger;

        public BookingRepository(Fantasis_TourismDbContext context, ILogger<BookingRepository> logger)
        {
            _context = context;
            _logger = logger;
        }
        public async Task<bool> AddAsync(Fantasis_Tourism_DataAccess.Model.Booking booking)
        {
            try
            {
                await _context.Booking.AddAsync(booking);

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return false;
            }

        }

        public async Task<List<Booking>> GetUserRequest(string userId)
        {
            var bookings = await _context.Booking
            .Include(b => b.Property)
            .Where(b => b.UserId == userId && b.status == Enum_Status.pending)
            .ToListAsync();
            return bookings;
        }
        public async Task<List<Booking>> GetRequestForUser(string hostId)
        {
            var bookings = await _context.Booking
            .Include(b => b.Property)
            .Where(b => b.HostId == hostId && b.status == Enum_Status.pending)
            .ToListAsync();
            return bookings;
        }

        public async Task<bool> RejectRequest(Guid requestId)
        {
            var request = await _context.Booking.FirstOrDefaultAsync(p => p.Id == requestId);
            if (request == null)
            {
                return false;
            }
            request.status = Enum_Status.rejected;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CancelRequest(Guid requestId)
        {
            var request = await _context.Booking.FirstOrDefaultAsync(p => p.Id == requestId);
            if (request == null)
            {
                return false;
            }
            request.status = Enum_Status.cancelled;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Booking> GetRequestById(Guid requestId)
        {
            try
            {
                var request = await _context.Booking.FirstOrDefaultAsync(p => p.Id == requestId);
                return request;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return null;
            }
        }
    }
}
