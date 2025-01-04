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
                bool isDateChanged = existingAppointment.AppointmentDate != appointmentDto.AppointmentDate;

                existingAppointment.UserID = appointmentDto.UserID;
                existingAppointment.ServiceID = appointmentDto.ServiceID;
                existingAppointment.AppointmentDate = appointmentDto.AppointmentDate;
                existingAppointment.Status = appointmentDto.Status;
                existingAppointment.Notes = appointmentDto.Notes;

                _context.Entry(existingAppointment).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                // Update ServiceStaff date if appointment date changes
                if (isDateChanged && appointmentDto.Status?.ToLower() == "përfunduar")
                {
                    var serviceStaff = await _context.ServiceStaff
                        .FirstOrDefaultAsync(ss => ss.ServiceID == existingAppointment.ServiceID && ss.StaffID == appointmentDto.UserID);

                    if (serviceStaff != null)
                    {
                        serviceStaff.DateCompleted = appointmentDto.AppointmentDate;
                        _context.ServiceStaff.Update(serviceStaff);
                        await _context.SaveChangesAsync();
                    }
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
        [HttpGet("total-completed-appointments")]
        public async Task<IActionResult> GetTotalCompletedAppointments()
        {
            try
            {
                var startOfMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);
                var completedAppointmentsCount = await _context.Appointments
                    .Where(a => a.Status == "përfunduar" && a.AppointmentDate >= startOfMonth && a.AppointmentDate <= endOfMonth)
                    .CountAsync();

                return Ok(new { completedAppointmentsCount });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching completed appointments: {ex.Message}");
                return StatusCode(500, "An error occurred while fetching completed appointments.");
            }
        }
        [HttpGet("total-revenue")]
        public async Task<IActionResult> GetTotalRevenueForCompletedAppointments([FromQuery] string period = "month")
        {
            try
            {
                DateTime startDate;
                DateTime endDate;

                if (period.ToLower() == "day")
                {
                    startDate = DateTime.Today;
                    endDate = DateTime.Today.AddDays(1);
                }
                else if (period.ToLower() == "week")
                {
                    startDate = DateTime.Now.StartOfWeek(DayOfWeek.Monday); // Using the StartOfWeek extension method
                    endDate = startDate.AddDays(7); // End of the week
                }
                else
                {
                    // Default is month
                    startDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                    endDate = startDate.AddMonths(1).AddDays(-1);
                }

                var totalRevenue = await _context.Appointments
                    .Where(a => a.Status.ToLower() == "përfunduar" && a.AppointmentDate >= startDate && a.AppointmentDate <= endDate)
                    .SumAsync(a => a.Service.Price);

                return Ok(new { totalRevenue });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error calculating total revenue: {ex.Message}");
                return StatusCode(500, "An error occurred while calculating the total revenue.");
            }
        }

        [HttpGet("total-sales")]
        public async Task<IActionResult> GetTotalSalesForCompletedAppointments([FromQuery] string period = "month")
        {
            try
            {
                DateTime startDate;
                DateTime endDate;

                if (period.ToLower() == "day")
                {
                    startDate = DateTime.Today;
                    endDate = DateTime.Today.AddDays(1);
                }
                else if (period.ToLower() == "week")
                {
                    startDate = DateTime.Now.StartOfWeek(DayOfWeek.Monday); // Using the StartOfWeek extension method
                    endDate = startDate.AddDays(7); // End of the week
                }
                else
                {
                    // Default is month
                    startDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                    endDate = startDate.AddMonths(1).AddDays(-1);
                }

                var totalSales = await _context.Appointments
                    .Where(a => a.Status.ToLower() == "përfunduar" && a.AppointmentDate >= startDate && a.AppointmentDate <= endDate)
                    .CountAsync();

                return Ok(new { totalSales });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error calculating total sales: {ex.Message}");
                return StatusCode(500, "An error occurred while calculating the total sales.");
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
        [HttpGet("daily-summary")]
        public async Task<IActionResult> GetDailySummary()
        {
            try
            {
                var dailySummary = await _context.Appointments
                    .Include(a => a.User) // Include staff
                    .Include(a => a.Service) // Include service
                    .GroupBy(a => a.AppointmentDate.Date)
                    .Select(group => new
                    {
                        Date = group.Key,
                        Appointments = group.Select(a => new
                        {
                            a.AppointmentID,
                            a.AppointmentDate,
                            a.Status,
                            a.Notes,
                            StaffName = a.User != null ? $"{a.User.FirstName} {a.User.LastName}" : "No Staff",
                            ServiceName = a.Service != null ? a.Service.ServiceName : "No Service",
                            ServicePrice = a.Service != null ? a.Service.Price : 0,
                            Client = a.Client != null ? new
                            {
                                a.Client.FirstName,
                                a.Client.LastName
                            } : null
                        }).ToList(),
                        TotalPrice = group.Where(a => a.Status.ToLower() == "përfunduar")
                                          .Sum(a => a.Service.Price)
                    })
                    .OrderBy(x => x.Date)
                    .ToListAsync();

                return Ok(dailySummary);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching daily summary: {ex.Message}");
                return StatusCode(500, "An error occurred while fetching daily summary.");
            }
        }



[HttpGet("revenue-monthly")]
public async Task<IActionResult> GetRevenueMonthly()
{
    try
    {
        var monthlyRevenues = await _context.Appointments
            .Where(a => a.Status.ToLower() == "përfunduar")
            .GroupBy(a => new { a.AppointmentDate.Year, a.AppointmentDate.Month })
            .Select(group => new
            {
                Month = group.Key.Month,
                Year = group.Key.Year,
                TotalRevenue = group.Sum(a => a.Service.Price)
            })
            .OrderBy(x => x.Year)
            .ThenBy(x => x.Month)
            .ToListAsync();

        return Ok(monthlyRevenues);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error fetching monthly revenue: {ex.Message}");
        return StatusCode(500, "An error occurred while fetching monthly revenue.");
    }
}



        [HttpGet("schedule")]
        public async Task<IActionResult> GetDailySchedule([FromQuery] DateTime date)
        {
            try
            {
                var appointments = await _context.Appointments
                    .Include(a => a.User) // Include Staff
                    .Include(a => a.Service) // Include Service
                    .Include(a => a.Client) // Include Client
                    .Where(a => a.AppointmentDate.Date == date.Date) // Compare date part only
                    .Select(a => new
                    {
                        a.AppointmentID,
                        AppointmentDate = a.AppointmentDate,
                        a.Status,
                        ServiceName = a.Service != null ? a.Service.ServiceName : "No Service",
                        ClientName = a.Client != null ? $"{a.Client.FirstName} {a.Client.LastName}" : "No Client",
                        StaffName = a.User != null ? $"{a.User.FirstName} {a.User.LastName}" : "No Staff",
                        Price = a.Service != null ? a.Service.Price : 0
                    })
                    .OrderBy(a => a.AppointmentDate)
                    .ToListAsync();

                return Ok(new
                {
                    Appointments = appointments,
                    TimeSlots = GenerateTimeSlots() // Send time slots from the backend
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching daily schedule: {ex.Message}");
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        private List<string> GenerateTimeSlots()
        {
            var timeSlots = new List<string>();
            var startTime = new TimeSpan(9, 0, 0);
            var endTime = new TimeSpan(18, 0, 0);

            while (startTime <= endTime)
            {
                timeSlots.Add(startTime.ToString(@"hh\:mm"));
                startTime = startTime.Add(new TimeSpan(0, 30, 0)); // Add 30 minutes
            }

            return timeSlots;
        }




    }

    public static class DateTimeExtensions
    {
        public static DateTime StartOfWeek(this DateTime dateTime, DayOfWeek firstDayOfWeek)
        {
            var diff = dateTime.DayOfWeek - firstDayOfWeek;
            if (diff < 0)
            {
                diff += 7;
            }
            return dateTime.AddDays(-diff).Date;
        }
    }



}
