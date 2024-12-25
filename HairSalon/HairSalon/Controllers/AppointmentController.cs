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
                .Include(a => a.Client) // Include related Client data
                .Include(a => a.User) // Optionally include User data
                .Include(a => a.Service) // Optionally include Service data
                .Select(a => new
                {
                    a.AppointmentID,
                    Client = a.Client != null ? new
                    {
                        a.Client.FirstName,
                        a.Client.LastName,
                        a.Client.PhoneNumber,
                        a.Client.Email
                    } : null,
                    a.UserID,
                    a.ServiceID,
                    a.AppointmentDate,
                    a.Status,
                    a.Notes
                })
                .ToListAsync();

            return Ok(appointments);
        }
        // Get the clients data by id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Client)
                .Include(a => a.User)
                .Include(a => a.Service)
                .Select(a => new
                {
                    a.AppointmentID,
                    Client = a.Client != null ? new
                    {
                        a.Client.FirstName,
                        a.Client.LastName,
                        a.Client.PhoneNumber,
                        a.Client.Email
                    } : null,
                    a.UserID,
                    a.ServiceID,
                    a.AppointmentDate,
                    a.Status,
                    a.Notes
                })
                .FirstOrDefaultAsync(m => m.AppointmentID == id);

            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            return Ok(appointment);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] AppointmentDto appointmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid request payload.");
            }

            try
            {
                // Extract client details
                var clientDto = appointmentDto.Client;
                Client client = null;

                if (clientDto != null)
                {
                    var existingClient = await _context.Clients
                        .FirstOrDefaultAsync(c => c.FirstName == clientDto.FirstName &&
                                                  c.LastName == clientDto.LastName &&
                                                  c.PhoneNumber == clientDto.PhoneNumber &&
                                                  c.Email == clientDto.Email);

                    if (existingClient == null)
                    {
                        client = new Client
                        {
                            FirstName = clientDto.FirstName,
                            LastName = clientDto.LastName,
                            PhoneNumber = clientDto.PhoneNumber,
                            Email = clientDto.Email
                        };
                        _context.Clients.Add(client);
                        await _context.SaveChangesAsync();
                    }
                    else
                    {
                        client = existingClient;
                    }
                }

                // Create new appointment
                var appointment = new Appointment
                {
                    ClientID = client?.ClientID,
                    UserID = appointmentDto.UserID,
                    ServiceID = appointmentDto.ServiceID,
                    AppointmentDate = appointmentDto.AppointmentDate,
                    Status = appointmentDto.Status,
                    Notes = appointmentDto.Notes
                };

                _context.Appointments.Add(appointment);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetAppointment), new { id = appointment.AppointmentID }, appointment);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, "An error occurred while creating the appointment.");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditAppointment(int id, [FromBody] Appointment appointment)
        {
            if (id != appointment.AppointmentID)
            {
                return BadRequest("Appointment ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingAppointment = await _context.Appointments.FindAsync(id);
            if (existingAppointment == null)
            {
                return NotFound("Appointment not found.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Update appointment details
                existingAppointment.UserID = appointment.UserID;
                existingAppointment.ServiceID = appointment.ServiceID;
                existingAppointment.AppointmentDate = appointment.AppointmentDate;
                existingAppointment.Status = appointment.Status;
                existingAppointment.Notes = appointment.Notes;

                if (appointment.Client != null)
                {
                    var existingClient = await _context.Clients
                        .FirstOrDefaultAsync(c => c.FirstName == appointment.Client.FirstName &&
                                                  c.LastName == appointment.Client.LastName &&
                                                  c.PhoneNumber == appointment.Client.PhoneNumber &&
                                                  c.Email == appointment.Client.Email);

                    if (existingClient != null)
                    {
                        existingAppointment.ClientID = existingClient.ClientID;
                    }
                    else
                    {
                        _context.Clients.Add(appointment.Client);
                        await _context.SaveChangesAsync();
                        existingAppointment.ClientID = appointment.Client.ClientID;
                    }
                }

                _context.Entry(existingAppointment).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error editing appointment: {ex.Message}");
                return StatusCode(500, "An error occurred while editing the appointment.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            try
            {
                _context.Appointments.Remove(appointment);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting appointment: {ex.Message}");
                return StatusCode(500, "An error occurred while deleting the appointment.");
            }
        }
    }
}
