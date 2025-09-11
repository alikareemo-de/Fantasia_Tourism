namespace Fantasis_Tourism_DataAccess.Model
{
    public class PaymentMethod
    {
        public Guid Id { get; set; } = new Guid();

        public string UserId { get; set; }
        public string? CardNumber { get; set; }
        public string? CardholderName { get; set; }
        public string? ExpiryDate { get; set; }
        public string? BillingAddress { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? State { get; set; }
        public string? ZipCode { get; set; }
        public Users? User { get; set; }


    }

    public class PaymentMethodDto
    {
        public Guid Id { get; set; } = new Guid();

        public string? UserId { get; set; }
        public string? CardNumber { get; set; }
        public string? CardholderName { get; set; }
        public string? ExpiryDate { get; set; }
        public string? BillingAddress { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? State { get; set; }
        public string? ZipCode { get; set; }


    }
}
