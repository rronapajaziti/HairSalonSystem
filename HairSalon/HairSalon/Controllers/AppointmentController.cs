using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HairSalon.Models;
using System.Threading.Tasks;

namespace HairSalon.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly MyContext _context;

        public AppointmentController(MyContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAppointments()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Client)
                .Include(a => a.User)
                .Include(a => a.Service)
                .ToListAsync();
            return Ok(appointments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Client)
                .Include(a => a.User)
                .Include(a => a.Service)
                .FirstOrDefaultAsync(m => m.AppointmentID == id);

            if (appointment == null)
            {
                return NotFound();
            }

            return Ok(appointment);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] Appointment appointment)
        {
            if (ModelState.IsValid)
            {
                // Check if the client exists
                if (appointment.Client != null)
                {
                    var existingClient = await _context.Clients
                        .FirstOrDefaultAsync(c => c.FirstName == appointment.Client.FirstName &&
                                                  c.LastName == appointment.Client.LastName &&
                                                  c.PhoneNumber == appointment.Client.PhoneNumber &&
                                                  c.Email == appointment.Client.Email);
                    if (existingClient != null)
                    {
                        appointment.ClientID = existingClient.ClientID;
                        appointment.Client = null; // Clear the nested object to avoid conflicts
                    }
                    else
                    {
                        _context.Clients.Add(appointment.Client);
                        await _context.SaveChangesAsync();
                        appointment.ClientID = appointment.Client.ClientID;
                        appointment.Client = null; // Clear the nested object to avoid conflicts
                    }
                }

                _context.Appointments.Add(appointment);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetAppointment), new { id = appointment.AppointmentID }, appointment);
            }

            return BadRequest(ModelState);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditAppointment(int id, [FromBody] Appointment appointment)
        {
            if (id != appointment.AppointmentID)
            {
                return BadRequest();
            }

            if (ModelState.IsValid)
            {
                // Check if the client exists
                if (appointment.Client != null)
                {
                    var existingClient = await _context.Clients
                        .FirstOrDefaultAsync(c => c.FirstName == appointment.Client.FirstName &&
                                                  c.LastName == appointment.Client.LastName &&
                                                  c.PhoneNumber == appointment.Client.PhoneNumber &&
                                                  c.Email == appointment.Client.Email);
                    if (existingClient != null)
                    {
                        appointment.ClientID = existingClient.ClientID;
                        appointment.Client = null; // Clear the nested object to avoid conflicts
                    }
                    else
                    {
                        _context.Clients.Add(appointment.Client);
                        await _context.SaveChangesAsync();
                        appointment.ClientID = appointment.Client.ClientID;
                        appointment.Client = null; // Clear the nested object to avoid conflicts
                    }
                }

                try
                {
                    _context.Update(appointment);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AppointmentExists(id))
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

            return BadRequest(ModelState);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AppointmentExists(int id)
        {
            return _context.Appointments.Any(e => e.AppointmentID == id);
        }
    }
}

