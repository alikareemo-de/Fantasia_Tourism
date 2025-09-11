using Fantasis_Tourism_DataAccess.Enums;

namespace Fantasis_Tourism_DataAccess.Model
{
    public class PropertyDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public string? PropertyName { get; set; }
        public PropertyType? Type { get; set; }
        public string? Description { get; set; }
        public int Capacity { get; set; }
        public int PricePerNight { get; set; }
        public string? Status { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? Location { get; set; }
        public string[]? features { get; set; }
        public int Rooms { get; set; }
        public bool HasCar { get; set; }
        public string? TripPlan { get; set; }
        public DateTime? ExpireDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<PropertyImage> Images { get; set; } = new();
    }
}
