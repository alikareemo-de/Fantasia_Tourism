namespace Fantasis_Tourism_DataAccess.Model
{
    public class PropertyImage
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid PropertyId { get; set; }
        public string ImageName { get; set; }
        public bool IsMain { get; set; } = false;
        public string ImageUrl { get; set; }
        public Property? Property { get; set; }
    }
}
