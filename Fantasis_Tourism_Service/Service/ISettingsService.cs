using Fantasis_Tourism_DataAccess.Model;

namespace Fantasis_Tourism_Service.Service
{
    public interface ISettingsService
    {
        Task<Settings> LoadSettingsAsync();
        Task<bool> SaveSettingsAsync(Settings settings);
    }
}
