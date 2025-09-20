using Fantasis_Tourism_DataAccess.Model;
using Fantasis_Tourism_Service.Service;
using Microsoft.AspNetCore.Mvc;

namespace Fantasia_Tourism.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly IUserService _userService;
        private readonly JwtTokenService _jwtTokenService;

        public AccountController(IUserService userService, JwtTokenService jwtTokenService)
        {
            _userService = userService;
            _jwtTokenService = jwtTokenService;
        }


        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] LoginRequest signInData)
        {
            var user = await _userService.AuthenticateAsync(signInData.Username, signInData.Password);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            var token = _jwtTokenService.GenerateToken(user.Id.ToString(), user.Username, "User");

            //return Ok(new
            //{
            //    user = new
            //    {
            //        id = user.Id,
            //        username = user.Username,
            //        firstName = user.FirstName,
            //        lastName = user.LastName,
            //        email = user.Email,
            //        cellPhoneNumber = user.CellPhoneNumber,
            //        dateOfBirth = user.Dateofbirth,
            //        country = user.country,
            //        city = user.city,
            //        address = user.Address

            //    },
            //    token = token
            //});
            return Ok(new { token });
        }


        [HttpGet("GetUserById")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null) return NotFound();



            return Ok(user);
        }

        [HttpGet("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();

            var result = users.Select(user => new
            {
                user.Id,
                user.Username,
                user.Email,
            });

            return Ok(result);
        }

        [HttpPost("CreateUser")]
        public async Task<IActionResult> CreateUser([FromBody] Users user)
        {

            await _userService.AddUserAsync(user);
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, new
            {
                user.Id,
                user.Username,
                user.Email
            });
        }

        [HttpPut("UpdateUser")]
        public async Task<IActionResult> UpdateUser([FromBody] Users user)
        {

            try
            {
                var update = await _userService.UpdateUserAsync(user);
                if (update) return Ok(user);
                return BadRequest();
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }

        }

        [HttpPost("updatepayment")]
        public async Task<IActionResult> UpdatePaymentMethod(PaymentMethodDto paymentMethod)
        {
            var result = await _userService.AddOrUpdatePaymentMethodAsync(paymentMethod);
            if (!result) return BadRequest("Fail to save data");
            return Ok(result);
        }

        [HttpDelete("DeleteUser")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _userService.DeleteUserAsync(id);
            return NoContent();
        }

        [HttpGet("check-user-info")]
        public async Task<IActionResult> checkuserinfo(string userId)
        {
            return Ok(await _userService.CheckUserinfo(userId));
        }

        [HttpGet("getpaymentinfobyuserid/{userId}")]
        public async Task<IActionResult> Getpaymentinfo(string userId)
        {
            var info = await _userService.Getpaymentinfo(userId);
            if (info == null) return NoContent();
            return Ok(info);
        }
    }
}
