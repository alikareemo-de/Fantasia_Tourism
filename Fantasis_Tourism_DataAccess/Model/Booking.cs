namespace Fantasis_Tourism_DataAccess.Model
{
    public class Booking
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid PropertyId { get; set; }
        public Property? Property { get; set; }

        public string? UserId { get; set; }
        public Users? User { get; set; }

        public string? HostId { get; set; }
        public Users? Host { get; set; }

        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public string? ExpectedArrivalTime { get; set; }
        public int? NumberOfGuests { get; set; }
        public string? AdditionalNotes { get; set; }
    }
}
