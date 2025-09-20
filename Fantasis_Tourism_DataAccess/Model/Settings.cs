using Fantasis_Tourism_DataAccess.Enums;

namespace Fantasis_Tourism_DataAccess.Model
{


    public class Settings
    {
        public Theme Theme { get; set; }
        public bool EmailNotifications { get; set; }
        public bool SMSNotifications { get; set; }
    }
    public class SettingTable
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Key { get; set; } = default!;

        public string Value { get; set; } = default!;
    }
}
