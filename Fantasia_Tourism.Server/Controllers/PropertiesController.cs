using Fantasis_Tourism_DataAccess.Model;
using Fantasis_Tourism_Service.Service;
using Microsoft.AspNetCore.Mvc;

namespace Fantasia_Tourism.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertiesController : Controller
    {
        private readonly IPropertyService _propertyService;

        private readonly IWebHostEnvironment _env;

        public PropertiesController(IPropertyService propertyService, IWebHostEnvironment env)
        {
            _propertyService = propertyService;
            _env = env;
        }

        [HttpPost("Addproperties")]
        public async Task<IActionResult> AddProperty([FromBody] Property property)
        {

            bool add = await _propertyService.AddPropertyAsync(property);
            if (add) return Ok(property.Id);

            return BadRequest("Fail..!");
        }

        [HttpPost("Editproperties")]
        public async Task<IActionResult> Editproperty([FromBody] PropertyDto property)
        {
            if (property == null || property.Id == Guid.Empty)
            {
                return BadRequest("Invalid property data.");
            }
            if (await _propertyService.UpdateProerty(property))
            {
                return Ok(property);
            }
            return BadRequest("Fail to update data...!");
        }

        //[HttpPost("Editproperties")]
        //public async Task<IActionResult> Editproperties([FromBody] )


        [HttpPost("property-images-bulk")]
        public async Task<IActionResult> AddPropertyImage([FromBody] List<PropertyImage> propimages)
        {
            bool add = await _propertyService.AddPropImage(propimages);
            if (add) return Ok();
            return BadRequest("Fail..!");
        }

        [HttpGet("GetAllUserProperties")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetAllUserProperties(string userId)
        {
            List<PropertyDto> properties = new List<PropertyDto>();
            properties = await _propertyService.GetAllProperties(userId);
            return Ok(properties);
        }

        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetProperties(string userId)
        {
            List<PropertyDto> properties = new List<PropertyDto>();
            properties = await _propertyService.GetProperties();
            return Ok(properties);
        }

        [HttpGet("GetLastProperties")]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetLastProperties()
        {
            var result = await _propertyService.GetAllLastProperties();
            return Ok(result);
        }

        [HttpGet("GetPoropertyById")]
        public async Task<IActionResult> GetPoropertyById(string Id)
        {
            PropertyDto result = await _propertyService.GetPropertyById(Id);
            return Ok(result);
        }

        [HttpGet("DeletePropbyId")]
        public async Task<IActionResult> DeletePropertyId(string Id)
        {
            bool result = await _propertyService.DeleteProperty(Id);
            if (result)
            {
                return Ok();
            }
            return BadRequest();
        }



    }
}
