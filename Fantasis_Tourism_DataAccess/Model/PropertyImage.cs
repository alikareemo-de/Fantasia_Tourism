namespace Fantasis_Tourism_DataAccess.Model
{
    public class PropertyImage
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid? PropertyId { get; set; }
        public string? ImageName { get; set; }
        public bool IsMain { get; set; } = false;
        public string? base64 { get; set; }
        public string? contentType { get; set; }

        public Property? Property { get; set; }
    }

    public class PropertyImagemodal
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid? PropertyId { get; set; }
        public string? ImageName { get; set; }
        public bool IsMain { get; set; } = false;
        public string? base64 { get; set; }
        public string? contentType { get; set; }

        public Property? Property { get; set; }
    }
}
