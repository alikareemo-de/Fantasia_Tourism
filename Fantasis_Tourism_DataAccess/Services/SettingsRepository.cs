using Fantasis_Tourism_DataAccess.Enums;
using Fantasis_Tourism_DataAccess.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Fantasis_Tourism_DataAccess.Services
{
    public class SettingsRepository : ISettingsRepository
    {
        private readonly Fantasis_TourismDbContext _context;
        private readonly ILogger<SettingsRepository> _logger;

        public SettingsRepository(Fantasis_TourismDbContext context, ILogger<SettingsRepository> logger)
        {
            _context = context;
            _logger = logger;
        }
        public async Task<Settings> LoadSettingsAsync()
        {
            var settings = new Settings();
            var dict = await _context.SettingTables.ToDictionaryAsync(s => s.Key, s => s.Value);

            if (dict.TryGetValue("Theme", out var themeStr) &&
                Enum.TryParse<Theme>(themeStr, out var theme))
            {
                settings.Theme = theme;
            }

            if (dict.TryGetValue("EmailNotifications", out var emailStr) &&
                bool.TryParse(emailStr, out var emailNotif))
            {
                settings.EmailNotifications = emailNotif;
            }

            if (dict.TryGetValue("SMSNotifications", out var smsStr) &&
                bool.TryParse(smsStr, out var smsNotif))
            {
                settings.SMSNotifications = smsNotif;
            }

            return settings;
        }

        public async Task<bool> SaveSettingsAsync(Settings settings)
        {
            try
            {
                await SaveSettingAsync("Theme", settings.Theme.ToString());
                await SaveSettingAsync("EmailNotifications", settings.EmailNotifications.ToString());
                await SaveSettingAsync("SMSNotifications", settings.SMSNotifications.ToString());

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw;
            }
        }

        private async Task SaveSettingAsync(string key, string value)
        {
            var setting = await _context.SettingTables.FirstOrDefaultAsync(s => s.Key == key);
            if (setting == null)
            {
                _context.SettingTables.Add(new SettingTable { Key = key, Value = value });
            }
            else
            {
                setting.Value = value;
                _context.SettingTables.Update(setting);
            }
        }
    }
}
