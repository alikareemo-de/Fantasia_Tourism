using Fantasis_Tourism_DataAccess.Enums;

namespace Fantasis_Tourism_DataAccess.Model
{
    public class RequestsDto
    {
        public Guid Id { get; set; }
        public string? propertyId { get; set; }
        public string? propertyName { get; set; }
        public string? userId { get; set; }
        public string? hostId { get; set; }
        public DateTime? checkInDate { get; set; }
        public DateTime? checkOutDate { get; set; }
        public string? expectedArrival { get; set; }
        public int? numberOfGuests { get; set; }
        public string? additionalNotes { get; set; }
        public Enum_Status? status { get; set; }
        public DateTime? createdDate { get; set; }
    }
}
