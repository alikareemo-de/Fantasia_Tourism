using Fantasis_Tourism_DataAccess.Model;

namespace Fantasis_Tourism_DataAccess.Services
{
    public interface ISettingsRepository
    {
        Task<Settings> LoadSettingsAsync();
        Task<bool> SaveSettingsAsync(Settings settings);
    }
}
