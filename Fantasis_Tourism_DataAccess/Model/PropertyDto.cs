namespace Fantasis_Tourism_DataAccess.Model
{
    public class PropertyDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string PropertyName { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }

        public int? Price { get; set; }
        public string Status { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string MainImage { get; set; }
        public string[]? Allimgae { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
