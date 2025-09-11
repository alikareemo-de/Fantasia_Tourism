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


    }
}
