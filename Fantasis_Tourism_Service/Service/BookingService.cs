using Fantasis_Tourism_DataAccess.Model;
using Fantasis_Tourism_DataAccess.Services;
using Microsoft.Extensions.Logging;

namespace Fantasis_Tourism_Service.Service
{
    public class BookingService : IBookingService
    {

        private readonly IBookingRepository _bookingRepository;
        private readonly IPropertyRepository _propertyRepository;
        private readonly IUserRepository _userRepository;
        private IEmailSender _emailSender;

        private readonly ILogger<BookingService> _logger;

        public BookingService(IBookingRepository bookingRepository,
            IPropertyRepository propertyRepository, ILogger<BookingService> logger, IUserRepository userRepository, IEmailSender emailSender)
        {
            _bookingRepository = bookingRepository;
            _logger = logger;
            _propertyRepository = propertyRepository;
            _userRepository = userRepository;
            _emailSender = emailSender;
        }

        public async Task<bool> AddAsync(BookingRequest request)
        {
            try
            {
                var property = await _propertyRepository.GetPropertyById(request.PropertyId.ToString());

                if (property == null)
                    return false;

                var hostId = property.UserId;

                var booking = new Booking
                {
                    PropertyId = request.PropertyId,
                    UserId = request.UserId,
                    HostId = hostId.ToString(),
                    CheckInDate = request.CheckInDate == DateTime.MinValue ? (DateTime?)null : request.CheckInDate,
                    CheckOutDate = request.CheckOutDate == DateTime.MinValue ? (DateTime?)null : request.CheckOutDate,
                    ExpectedArrivalTime = request.ExpectedArrivalTime,
                    NumberOfGuests = request.NumberOfGuests,
                    AdditionalNotes = request.AdditionalNotes,
                    status = Fantasis_Tourism_DataAccess.Enums.Enum_Status.pending,
                };

                var add = await _bookingRepository.AddAsync(booking);
                if (add)
                {
                    var user = await _userRepository.GetByIdAsync(hostId.ToString());
                    if (user != null)
                    {
                        await _emailSender.SendEmailAsync(user.Email, "New request", $"you have new client for property: {property.PropertyName}");
                    }

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

        public async Task<List<RequestsDto>> GetUserRequest(string userId)
        {
            var request = await _bookingRepository.GetUserRequest(userId);
            if (request == null)
            {
                return null;
            }
            List<RequestsDto> result = new List<RequestsDto>();
            foreach (var item in request)
            {
                result.Add(new RequestsDto
                {
                    Id = item.Id,
                    propertyId = item.Property.Id.ToString(),
                    propertyName = item.Property.PropertyName,
                    userId = item.UserId,
                    hostId = item.HostId,
                    createdDate = item.createdDate,
                    checkInDate = item.CheckInDate,
                    checkOutDate = item.CheckOutDate,
                    expectedArrival = item.ExpectedArrivalTime,
                    numberOfGuests = item.NumberOfGuests,
                    additionalNotes = item.AdditionalNotes,
                    status = item.status,

                });
            }
            return result;
        }
        public async Task<List<RequestsDto>> GetRequestForUser(string hostId)
        {
            var request = await _bookingRepository.GetRequestForUser(hostId);
            if (request == null)
            {
                return null;
            }
            List<RequestsDto> result = new List<RequestsDto>();
            foreach (var item in request)
            {
                result.Add(new RequestsDto
                {
                    Id = item.Id,
                    propertyId = item.Property.Id.ToString(),
                    propertyName = item.Property.PropertyName,
                    userId = item.UserId,
                    hostId = item.HostId,
                    createdDate = item.createdDate,
                    checkInDate = item.CheckInDate,
                    checkOutDate = item.CheckOutDate,
                    expectedArrival = item.ExpectedArrivalTime,
                    numberOfGuests = item.NumberOfGuests,
                    additionalNotes = item.AdditionalNotes,
                    status = item.status,

                });
            }
            return result;
        }
        public async Task<bool> RejectRequest(string requestId)
        {
            if (Guid.TryParse(requestId, out Guid Id))
            {
                var reject = await _bookingRepository.RejectRequest(Id);
                if (reject)
                {
                    var request = await _bookingRepository.GetRequestById(Id);
                    var property = await _propertyRepository.GetPropertyById(request.PropertyId.ToString());
                    var user = await _userRepository.GetByIdAsync(request.UserId);
                    if (user != null)
                    {
                        await _emailSender.SendEmailAsync(user.Email, "New request", $"you have new client for property: {property.PropertyName}");
                    }
                    return true;
                }
            }
            return false;
        }
        public async Task<bool> CancelRequest(string requestId)
        {
            if (Guid.TryParse(requestId, out Guid Id))
            {
                var cancel = await _bookingRepository.CancelRequest(Id);
                if (cancel)
                {
                    var request = await _bookingRepository.GetRequestById(Id);
                    var property = await _propertyRepository.GetPropertyById(request.PropertyId.ToString());
                    var user = await _userRepository.GetByIdAsync(request.HostId);
                    if (user != null)
                    {
                        await _emailSender.SendEmailAsync(user.Email, "New request", $"you have new client for property: {property.PropertyName}");
                    }
                    return true;
                }
            }
            return false;
        }


    }
}
