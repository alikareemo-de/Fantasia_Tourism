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

        [HttpGet("GetUserRequest")]
        public async Task<IActionResult> GetUserRequest(string userId)
        {
            var result = await _bookingService.GetUserRequest(userId);
            if (result == null) return BadRequest();

            return Ok(result);
        }

        [HttpGet("GetRequestForUser")]
        public async Task<IActionResult> GetRequestForUser(string hostId)
        {
            var result = await _bookingService.GetRequestForUser(hostId);
            if (result == null) return BadRequest();

            return Ok(result);
        }

        [HttpGet("RejectRequest")]
        public async Task<IActionResult> RejectRequest(string requestId)
        {
            if (await _bookingService.RejectRequest(requestId))
            {
                return Ok("Done");
            }
            return BadRequest();
        }

        [HttpGet("CancelRequest")]
        public async Task<IActionResult> CancelRequest(string requestId)
        {
            if (await _bookingService.CancelRequest(requestId))
            {
                return Ok("Done");
            }
            return BadRequest();
        }

    }
}
