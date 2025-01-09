using HairSalon.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace HairSalon.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly MyContext _context;
        private readonly IConfiguration _configuration;

        public UserController(MyContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        [HttpGet("")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var users = await _context.Users
                    .Select(u => new
                    {
                        u.UserID,
                        u.FirstName,
                        u.LastName,
                        u.Email,
                        u.PhoneNumber,
                        u.RoleID,
                        Appointments = u.Appointments.Select(a => new
                        {
                            a.AppointmentID,
                            a.AppointmentDate,
                            a.Status
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while fetching users." });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(); // If the user is not found, it will return a 404
            }
            return Ok(user);
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                return BadRequest(new { error = "Email already exists." });
            }

            using (var hmac = new HMACSHA512())
            {
                user.PasswordSalt = Convert.ToBase64String(hmac.Key);
                user.PasswordHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(user.PasswordHash)));

                user.RoleID = user.RoleID != 0 ? user.RoleID : 3;
            }

            user.Appointments = user.Appointments ?? new List<Appointment>();

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully." });
        }

        // Login user
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users
                .Include(u => u.Appointments)
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !VerifyPassword(request.Password, user.PasswordHash, user.PasswordSalt))
            {
                return Unauthorized(new { error = "Invalid credentials." });
            }

            var accessToken = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();
            SetRefreshTokenCookie(refreshToken);

            return Ok(new
            {
                Token = accessToken,  // Access token
                RefreshToken = refreshToken,
                User = new
                {
                    UserID = user.UserID,
                    user.FirstName,
                    user.LastName,
                    user.PhoneNumber,
                    user.Email,
                    user.RoleID,
                    Appointments = user.Appointments.Select(a => new
                    {
                        a.AppointmentID,
                        a.AppointmentDate,
                        a.Status
                    }).ToList()
                }
            });
        }

        [HttpGet("staff")]
        public async Task<IActionResult> GetStaff()
        {
            var staff = await _context.Users
                .Where(u => u.RoleID == 3)
                .Select(u => new
                {
                    u.UserID,
                    u.FirstName,
                    u.LastName
                })
                .ToListAsync();

            return Ok(staff);
        }

        // Refresh the access token
        [HttpPost("refresh-token")]
        public IActionResult RefreshToken()
        {
            var refreshToken = Request.Cookies["refresh_token"];
            if (string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized(new { error = "No refresh token provided." });
            }

            var user = ValidateRefreshToken(refreshToken);
            if (user == null)
            {
                return Unauthorized(new { error = "Invalid refresh token." });
            }

            var newAccessToken = GenerateJwtToken(user);
            return Ok(new { Token = newAccessToken });
        }

        // Logout the user
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("refresh_token");
            return Ok(new { message = "Logged out successfully." });
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim("RolesID", user.RoleID.ToString()) // Include RolesID claim
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30), // Adjust expiration as needed
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        private string GenerateRefreshToken()
        {
            var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            return refreshToken;
        }

        private void SetRefreshTokenCookie(string refreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,  // Secure the cookie from JavaScript access
                Secure = true,    // Ensures cookies are only sent over HTTPS
                SameSite = SameSiteMode.Strict,  // Prevents cross-site request forgery
                Expires = DateTime.UtcNow.AddDays(7)  // Set the expiration of the refresh token
            };

            Response.Cookies.Append("refresh_token", refreshToken, cookieOptions);
        }

        private User ValidateRefreshToken(string refreshToken)
        {
            // You should implement this to check the refresh token from the database
            var user = _context.Users.FirstOrDefault(u => u.RefreshToken == refreshToken);
            return user;
        }

        private bool VerifyPassword(string password, string storedHash, string storedSalt)
        {
            using (var hmac = new HMACSHA512(Convert.FromBase64String(storedSalt)))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(computedHash) == storedHash;
            }
        }

        [HttpGet("total-staff")]
        public IActionResult GetTotalStaff()
        {
            var totalStaff = _context.Users.Count(u => u.RoleID == 3); 
            return Ok(new { totalStaff });
        }
        [Authorize(Policy = "AdminPolicy")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();  // 204 No Content response
        }
        [Authorize(Policy = "AdminPolicy")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User updatedUser)
        {
            if (id != updatedUser.UserID)
            {
                return BadRequest("User ID mismatch.");
            }

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            existingUser.FirstName = updatedUser.FirstName;
            existingUser.LastName = updatedUser.LastName;
            existingUser.PhoneNumber = updatedUser.PhoneNumber;
            existingUser.Email = updatedUser.Email;

            // You can update the password only if it's provided
            if (!string.IsNullOrEmpty(updatedUser.PasswordHash))
            {
                using (var hmac = new HMACSHA512())
                {
                    existingUser.PasswordSalt = Convert.ToBase64String(hmac.Key);
                    existingUser.PasswordHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(updatedUser.PasswordHash)));
                }
            }

            existingUser.RoleID = updatedUser.RoleID; // Ensure you are not changing the user's role incorrectly

            _context.Users.Update(existingUser);
            await _context.SaveChangesAsync();

            return NoContent(); // Success, no content returned
        }
    }


    // Login Request DTO
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
