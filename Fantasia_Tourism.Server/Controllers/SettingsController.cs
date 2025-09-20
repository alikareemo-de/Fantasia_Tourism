using Fantasis_Tourism_DataAccess.Model;
using Fantasis_Tourism_Service.Service;
using Microsoft.AspNetCore.Mvc;

namespace Fantasia_Tourism.Server.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController : Controller
    {

        private readonly ISettingsService _settingsService;

        public SettingsController(ISettingsService settingsService)
        {
            _settingsService = settingsService;
        }
        public IActionResult Index()
        {
            return View();
        }


        [HttpPost("updatesettings")]
        public async Task<IActionResult> updatesettings(Settings settings)
        {
            var result = await _settingsService.SaveSettingsAsync(settings);
            if (result) return Ok();
            return BadRequest();
        }

        [HttpGet("getsettings")]
        public async Task<IActionResult> getsettings()
        {
            var result = await _settingsService.LoadSettingsAsync();
            if (result == null) return BadRequest();
            return Ok(result);

        }
    }
}
