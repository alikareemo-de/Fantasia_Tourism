namespace Fantasis_Tourism_DataAccess.Model
{
    public class Property
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public string PropertyName { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public int Capacity { get; set; }
        public decimal PricePerNight { get; set; }
        public string Status { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Location { get; set; }
        public int Rooms { get; set; }
        public bool HasCar { get; set; }
        public string TripPlan { get; set; }
        public int? Price { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<PropertyImage> Images { get; set; } = new();
    }
}
