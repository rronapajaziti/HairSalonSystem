using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HairSalon.Models;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace HairSalon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceStaffController : ControllerBase
    {
        private readonly MyContext _context;

        public ServiceStaffController(MyContext context)
        {
            _context = context;
        }

        // GET: api/ServiceStaff
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceStaffDto>>> GetAllServiceStaff()
        {
            var serviceStaffList = await _context.ServiceStaff
                .Include(ss => ss.User)
                .Include(ss => ss.Service)
                .Include(ss => ss.Appointment)
                .Select(ss => new ServiceStaffDto
                {
                    ServiceStaffID = ss.ServiceStaffID,
                    UserName = ss.User.FirstName + " " + ss.User.LastName,
                    ServiceName = ss.Service.ServiceName,
                    AppointmentDate = ss.Appointment.AppointmentDate.ToString("yyyy-MM-dd"),
                    Percentage = ss.Percentage,
                    AmountEarned = ss.AmountEarned
                })
                .ToListAsync();

            return Ok(serviceStaffList);
        }

        // GET: api/ServiceStaff/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceStaffDto>> GetServiceStaff(int id)
        {
            var serviceStaff = await _context.ServiceStaff
                .Include(ss => ss.User)
                .Include(ss => ss.Service)
                .Include(ss => ss.Appointment)
                .Where(ss => ss.ServiceStaffID == id)
                .Select(ss => new ServiceStaffDto
                {
                    ServiceStaffID = ss.ServiceStaffID,
                    UserName = ss.User.FirstName + " " + ss.User.LastName,
                    ServiceName = ss.Service.ServiceName,
                    AppointmentDate = ss.Appointment.AppointmentDate.ToString("yyyy-MM-dd"),
                    Percentage = ss.Percentage,
                    AmountEarned = ss.AmountEarned
                })
                .FirstOrDefaultAsync();

            if (serviceStaff == null)
            {
                return NotFound();
            }

            return Ok(serviceStaff);
        }

        // POST: api/ServiceStaff
        [HttpPost]
        public async Task<IActionResult> AddServiceStaff(ServiceStaff serviceStaff)
        {
            // Validate foreign keys
            if (!_context.Users.Any(u => u.UserID == serviceStaff.UserID))
                return BadRequest("Invalid User ID.");
            if (!_context.Services.Any(s => s.ServiceID == serviceStaff.ServiceID))
                return BadRequest("Invalid Service ID.");
            if (!_context.Appointments.Any(a => a.AppointmentID == serviceStaff.AppointmentID))
                return BadRequest("Invalid Appointment ID.");

            _context.ServiceStaff.Add(serviceStaff);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetServiceStaff", new { id = serviceStaff.ServiceStaffID }, serviceStaff);
        }

        // PUT: api/ServiceStaff/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateServiceStaff(int id, ServiceStaff serviceStaff)
        {
            if (id != serviceStaff.ServiceStaffID)
            {
                return BadRequest();
            }

            // Validate foreign keys
            if (!_context.Users.Any(u => u.UserID == serviceStaff.UserID))
                return BadRequest("Invalid User ID.");
            if (!_context.Services.Any(s => s.ServiceID == serviceStaff.ServiceID))
                return BadRequest("Invalid Service ID.");
            if (!_context.Appointments.Any(a => a.AppointmentID == serviceStaff.AppointmentID))
                return BadRequest("Invalid Appointment ID.");

            _context.Entry(serviceStaff).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceStaffExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/ServiceStaff/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServiceStaff(int id)
        {
            var serviceStaff = await _context.ServiceStaff.FindAsync(id);
            if (serviceStaff == null)
            {
                return NotFound();
            }

            _context.ServiceStaff.Remove(serviceStaff);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ServiceStaffExists(int id)
        {
            return _context.ServiceStaff.Any(e => e.ServiceStaffID == id);
        }
    }

    public class ServiceStaffDto
    {
        public int ServiceStaffID { get; set; }
        public string UserName { get; set; }
        public string ServiceName { get; set; }
        public string AppointmentDate { get; set; }
        public decimal Percentage { get; set; }
        public decimal AmountEarned { get; set; }
    }
}
