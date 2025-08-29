namespace Fantasis_Tourism_DataAccess.Model
{
    public class Users
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; }
        public string? CellPhoneNumber { get; set; }
        public string? Dateofbirth { get; set; }
        public string? country { get; set; }
        public string? city { get; set; }
        public string? Address { get; set; }



    }
}
