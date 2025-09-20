using Fantasis_Tourism_DataAccess.Model;
using Fantasis_Tourism_DataAccess.Services;
using Microsoft.Extensions.Logging;

namespace Fantasis_Tourism_Service.Service
{
    public class SettingsService : ISettingsService
    {
        private readonly ISettingsRepository _settingsRepository;
        private readonly ILogger<SettingsService> _logger;
        public SettingsService(ISettingsRepository settingsRepository, ILogger<SettingsService> logger)
        {
            _settingsRepository = settingsRepository;
            _logger = logger;
        }
        Task<Settings> ISettingsService.LoadSettingsAsync()
        {
            try
            {
                return _settingsRepository.LoadSettingsAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return null!;
            }
        }

        public async Task<bool> SaveSettingsAsync(Settings settings)
        {
            try
            {
                return await _settingsRepository.SaveSettingsAsync(settings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return false;
            }
        }
    }
}
