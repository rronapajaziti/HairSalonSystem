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
            try
            {
                var appointments = await _context.Appointments
                    .Include(a => a.User) // Include Staff
                    .Include(a => a.Service) // Include Service
                    .Select(a => new
                    {
                        a.AppointmentID,
                        a.AppointmentDate,
                        a.Status,
                        a.Notes,
                        StaffName = a.User != null ? $"{a.User.FirstName} {a.User.LastName}" : "No Staff",
                        ServiceName = a.Service != null ? a.Service.ServiceName : "No Service",
                        a.ClientID,
                        Client = a.Client != null ? new
                        {
                            a.Client.FirstName,
                            a.Client.LastName,
                            a.Client.PhoneNumber,
                            a.Client.Email
                        } : null
                    })
                    .ToListAsync();

                return Ok(appointments);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching appointments: {ex.Message}");
                return StatusCode(500, "An error occurred while fetching appointments.");
            }
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

            using var transaction = await _context.Database.BeginTransactionAsync();
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

                // Only calculate and add ServiceStaff record if the appointment is marked as "përfunduar"
                if (appointmentDto.Status?.ToLower() == "përfunduar")
                {
                    var service = await _context.Services.FindAsync(appointmentDto.ServiceID);
                    if (service == null)
                    {
                        return BadRequest("Invalid Service ID.");
                    }

                    var serviceStaff = new ServiceStaff
                    {
                        ServiceID = service.ServiceID,
                        StaffID = appointmentDto.UserID, // Assuming UserID is the staff
                        DateCompleted = appointmentDto.AppointmentDate,
                        Price = service.Price,
                        StaffEarning = service.Price * (service.StaffEarningPercentage / 100)
                    };

                    _context.ServiceStaff.Add(serviceStaff);
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();

                return CreatedAtAction(nameof(GetAppointment), new { id = appointment.AppointmentID }, appointment);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error creating appointment: {ex.Message}");
                return StatusCode(500, "An error occurred while creating the appointment.");
            }
        }

    [HttpPut("{id}")]
public async Task<IActionResult> EditAppointment(int id, [FromBody] AppointmentDto appointmentDto)
{
    if (id != appointmentDto.AppointmentID)
    {
        return BadRequest("Appointment ID mismatch.");
    }

    var existingAppointment = await _context.Appointments
        .Include(a => a.Service)
        .FirstOrDefaultAsync(a => a.AppointmentID == id);

    if (existingAppointment == null)
    {
        return NotFound("Appointment not found.");
    }

    using var transaction = await _context.Database.BeginTransactionAsync();
    try
    {
        // Handle client information
        var clientDto = appointmentDto.Client;
        if (clientDto != null)
        {
            var existingClient = await _context.Clients
                .FirstOrDefaultAsync(c => c.FirstName == clientDto.FirstName &&
                                          c.LastName == clientDto.LastName &&
                                          c.PhoneNumber == clientDto.PhoneNumber &&
                                          c.Email == clientDto.Email);

            if (existingClient == null)
            {
                var newClient = new Client
                {
                    FirstName = clientDto.FirstName,
                    LastName = clientDto.LastName,
                    PhoneNumber = clientDto.PhoneNumber,
                    Email = clientDto.Email
                };
                _context.Clients.Add(newClient);
                await _context.SaveChangesAsync();
                existingAppointment.ClientID = newClient.ClientID;
            }
            else
            {
                existingAppointment.ClientID = existingClient.ClientID;
            }
        }

        // Update appointment details
        existingAppointment.UserID = appointmentDto.UserID;
        existingAppointment.ServiceID = appointmentDto.ServiceID;
        existingAppointment.AppointmentDate = appointmentDto.AppointmentDate;
        existingAppointment.Status = appointmentDto.Status;
        existingAppointment.Notes = appointmentDto.Notes;

        _context.Entry(existingAppointment).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        // Add or update ServiceStaff only if the status is "përfunduar"
        if (appointmentDto.Status?.ToLower() == "përfunduar")
        {
            var service = await _context.Services.FindAsync(existingAppointment.ServiceID);
            if (service == null)
            {
                return BadRequest("Invalid Service ID.");
            }

            // Check if a ServiceStaff record already exists for this appointment
            var existingServiceStaff = await _context.ServiceStaff
                .FirstOrDefaultAsync(ss => ss.ServiceID == existingAppointment.ServiceID && ss.StaffID == appointmentDto.UserID);

            if (existingServiceStaff == null)
            {
                var serviceStaff = new ServiceStaff
                {
                    ServiceID = service.ServiceID,
                    StaffID = appointmentDto.UserID,
                    DateCompleted = existingAppointment.AppointmentDate,
                    Price = service.Price,
                    StaffEarning = service.Price * (service.StaffEarningPercentage / 100)
                };
                _context.ServiceStaff.Add(serviceStaff);
            }
            else
            {
                existingServiceStaff.DateCompleted = existingAppointment.AppointmentDate;
                existingServiceStaff.Price = service.Price;
                existingServiceStaff.StaffEarning = service.Price * (service.StaffEarningPercentage / 100);
                _context.ServiceStaff.Update(existingServiceStaff);
            }

            await _context.SaveChangesAsync();
        }

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
        [HttpGet("total-price")]
        public async Task<IActionResult> GetTotalPriceForCompletedAppointments()
        {
            try
            {
                var totalPrice = await _context.Appointments
                    .Where(a => a.Status.ToLower() == "përfunduar")
                    .SumAsync(a => a.Service.Price);

                return Ok(totalPrice);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error calculating total price: {ex.Message}");
                return StatusCode(500, "An error occurred while calculating the total price.");
            }
        }


        // Appointmens for
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetAppointmentsByUser(int userId)
        {
            var appointments = await _context.Appointments
                .Include(a => a.Client)
                .Include(a => a.User)
                .Include(a => a.Service)
                .Where(a => a.UserID == userId)
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
                    a.Notes,
                    ServiceName = a.Service != null ? a.Service.ServiceName : "No Service"
                })
                .ToListAsync();

            if (appointments == null || !appointments.Any())
            {
                return NotFound("No appointments found for the user.");
            }

            return Ok(appointments);
        }


    }

}
