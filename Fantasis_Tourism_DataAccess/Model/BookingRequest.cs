namespace Fantasis_Tourism_DataAccess.Model
{
    public class BookingRequest
    {
        public Guid PropertyId { get; set; }
        public string UserId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public string? ExpectedArrivalTime { get; set; }
        public int? NumberOfGuests { get; set; }
        public string? AdditionalNotes { get; set; }
    }
}
