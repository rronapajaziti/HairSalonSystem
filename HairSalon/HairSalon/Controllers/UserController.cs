using HairSalon.Models;
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

        // Register a new user
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
                user.RoleID = 3;
            }

            user.Appointments = user.Appointments ?? new List<Appointment>();

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully." });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users
                .Include(u => u.Appointments) // Include related appointments
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !VerifyPassword(request.Password, user.PasswordHash, user.PasswordSalt))
            {
                return Unauthorized(new { error = "Invalid credentials." });
            }

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                Token = token,
                User = new
                {
                    UserID = user.UserID, // Ensure this matches the expected property name
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
        .Where(u => u.RoleID == 3)  // Ensure we filter only staff with RoleID = 3
        .Select(u => new
        {
            u.UserID,
            u.FirstName,
            u.LastName
        })
        .ToListAsync();

    return Ok(staff);
}





        // Get all users
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.UserID,
                    u.FirstName,
                    u.LastName,
                    u.PhoneNumber,
                    u.Email,
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

        // Get a single user by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users
                .Where(u => u.UserID == id)
                .Select(u => new
                {
                    u.UserID,
                    u.FirstName,
                    u.LastName,
                    u.PhoneNumber,
                    u.Email,
                    u.RoleID,
                    Appointments = u.Appointments.Select(a => new
                    {
                        a.AppointmentID,
                        a.AppointmentDate,
                        a.Status
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // Update user information
        [HttpPut("{id}")]
        public async Task<IActionResult> EditUser(int id, [FromBody] User updatedUser)
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
            existingUser.RoleID = updatedUser.RoleID;

            _context.Users.Update(existingUser);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Delete a user
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

            return NoContent();
        }

        // Generate JWT Token
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.RoleID.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Verify password with hash and salt
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
            var totalStaff = _context.Users.Count(u => u.RoleID == 3); // Assuming RoleID 3 is for staff
            return Ok(new { totalStaff });
        }
    }
 

    // Login Request DTO
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
