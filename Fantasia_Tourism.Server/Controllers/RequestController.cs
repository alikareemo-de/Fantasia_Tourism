using Fantasis_Tourism_DataAccess.Model;
using Fantasis_Tourism_Service.Service;
using Microsoft.AspNetCore.Mvc;

namespace Fantasia_Tourism.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequestController : Controller
    {
        private readonly IBookingService _bookingService;


        public RequestController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        public IActionResult Index()
        {
            return View();
        }


        [HttpPost("AddBook")]
        public async Task<IActionResult> AddBooking([FromBody] BookingRequest request)
        {
            try
            {
                var add = await _bookingService.AddAsync(request);
                if (add)
                {
                    return Ok(add);
                }
                return BadRequest();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

    }
}
