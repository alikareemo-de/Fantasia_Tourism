using Fantasis_Tourism_DataAccess.Model;
using Fantasis_Tourism_DataAccess.Services;
using Microsoft.Extensions.Logging;

namespace Fantasis_Tourism_Service.Service
{
    public class BookingService : IBookingService
    {

        private readonly IBookingRepository _bookingRepository;
        private readonly IPropertyRepository _propertyRepository;

        private readonly ILogger<BookingService> _logger;

        public BookingService(IBookingRepository bookingRepository, IPropertyRepository propertyRepository, ILogger<BookingService> logger)
        {
            _bookingRepository = bookingRepository;
            _logger = logger;
            _propertyRepository = propertyRepository;
        }

        public async Task<bool> AddAsync(BookingRequest request)
        {
            try
            {
                // 1. تأكد أن الـ Property موجود
                var property = await _propertyRepository.GetPropertyById(request.PropertyId.ToString());

                if (property == null)
                    return false;

                var hostId = property.UserId;

                var booking = new Booking
                {
                    PropertyId = request.PropertyId,
                    UserId = request.UserId,
                    HostId = hostId.ToString(),
                    CheckInDate = request.CheckInDate,
                    CheckOutDate = request.CheckOutDate,
                    ExpectedArrivalTime = request.ExpectedArrivalTime,
                    NumberOfGuests = request.NumberOfGuests,
                    AdditionalNotes = request.AdditionalNotes
                };

                var add = await _bookingRepository.AddAsync(booking);
                if (add)
                {
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while adding booking");
                return false;
            }
        }
    }
}
