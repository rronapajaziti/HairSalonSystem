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
            if (appointmentDto == null)
                return BadRequest("Invalid request payload.");

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Validate and fetch client details
                Client client = null;
                if (appointmentDto.Client != null)
                {
                    client = await _context.Clients
                        .FirstOrDefaultAsync(c =>
                            c.FirstName == appointmentDto.Client.FirstName &&
                            c.LastName == appointmentDto.Client.LastName &&
                            c.PhoneNumber == appointmentDto.Client.PhoneNumber &&
                            c.Email == appointmentDto.Client.Email);

                    if (client == null)
                    {
                        client = new Client
                        {
                            FirstName = appointmentDto.Client.FirstName,
                            LastName = appointmentDto.Client.LastName,
                            PhoneNumber = appointmentDto.Client.PhoneNumber,
                            Email = appointmentDto.Client.Email
                        };
                        _context.Clients.Add(client);
                        await _context.SaveChangesAsync();
                    }
                }

                // Validate Service
                var service = await _context.Services.FindAsync(appointmentDto.ServiceID);
                if (service == null)
                    return BadRequest("Invalid Service ID.");

                // Validate User
                var user = await _context.Users.FindAsync(appointmentDto.UserID);
                if (user == null)
                    return BadRequest("Invalid User ID.");

                // Create the appointment
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

                // Add ServiceStaff if status is "përfunduar"
                if (appointmentDto.Status?.ToLower() == "përfunduar")
                {
                    var serviceStaff = new ServiceStaff
                    {
                        ServiceID = appointmentDto.ServiceID,
                        UserID = appointmentDto.UserID,
                        DateCompleted = appointmentDto.AppointmentDate,
                        Price = service.Price,
                        StaffEarning = service.Price * (service.StaffEarningPercentage / 100)
                    };
                    _context.ServiceStaff.Add(serviceStaff);

                    // Save changes to ensure ServiceStaff is added
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();
                return CreatedAtAction(nameof(GetAppointments), new { id = appointment.AppointmentID }, appointment);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error creating appointment: {ex.Message}");
                return StatusCode(500, "An error occurred while creating the appointment.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Service)
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.AppointmentID == id);

            if (appointment == null)
                return NotFound("Appointment not found.");

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Remove associated ServiceStaff record(s)
                var serviceStaff = await _context.ServiceStaff
                    .Where(ss => ss.ServiceID == appointment.ServiceID && ss.UserID == appointment.UserID)
                    .ToListAsync();

                if (serviceStaff.Any())
                {
                    _context.ServiceStaff.RemoveRange(serviceStaff);
                }

                // Remove the appointment
                _context.Appointments.Remove(appointment);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error deleting appointment: {ex.Message}");
                return StatusCode(500, "An error occurred while deleting the appointment.");
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> EditAppointment(int id, [FromBody] AppointmentDto appointmentDto)
        {
            if (id != appointmentDto.AppointmentID)
                return BadRequest("Appointment ID mismatch.");

            var existingAppointment = await _context.Appointments
                .Include(a => a.Service)
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.AppointmentID == id);

            if (existingAppointment == null)
                return NotFound("Appointment not found.");

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Find the old ServiceStaff record
                var oldServiceStaff = await _context.ServiceStaff.FirstOrDefaultAsync(ss =>
                    ss.ServiceID == existingAppointment.ServiceID &&
                    ss.UserID == existingAppointment.UserID &&
                    ss.DateCompleted == existingAppointment.AppointmentDate);

                // Update appointment details
                existingAppointment.UserID = appointmentDto.UserID;
                existingAppointment.ServiceID = appointmentDto.ServiceID;
                existingAppointment.AppointmentDate = appointmentDto.AppointmentDate;
                existingAppointment.Status = appointmentDto.Status;
                existingAppointment.Notes = appointmentDto.Notes;

                _context.Entry(existingAppointment).State = EntityState.Modified;

                // Synchronize ServiceStaff record
                var newService = await _context.Services.FindAsync(appointmentDto.ServiceID);

                if (appointmentDto.Status?.ToLower() == "përfunduar")
                {
                    // Update or create ServiceStaff record
                    if (oldServiceStaff != null)
                    {
                        // Update the old ServiceStaff record if it exists
                        oldServiceStaff.ServiceID = appointmentDto.ServiceID;
                        oldServiceStaff.UserID = appointmentDto.UserID;
                        oldServiceStaff.DateCompleted = appointmentDto.AppointmentDate;
                        oldServiceStaff.Price = newService.Price;
                        oldServiceStaff.StaffEarning = newService.Price * (newService.StaffEarningPercentage / 100);

                        _context.ServiceStaff.Update(oldServiceStaff);
                    }
                    else
                    {
                        // Check if a ServiceStaff record for the new details already exists
                        var newServiceStaff = await _context.ServiceStaff.FirstOrDefaultAsync(ss =>
                            ss.ServiceID == appointmentDto.ServiceID &&
                            ss.UserID == appointmentDto.UserID &&
                            ss.DateCompleted == appointmentDto.AppointmentDate);

                        if (newServiceStaff == null)
                        {
                            // Create a new ServiceStaff entry if no matching record exists
                            newServiceStaff = new ServiceStaff
                            {
                                ServiceID = appointmentDto.ServiceID,
                                UserID = appointmentDto.UserID,
                                DateCompleted = appointmentDto.AppointmentDate,
                                Price = newService.Price,
                                StaffEarning = newService.Price * (newService.StaffEarningPercentage / 100)
                            };

                            _context.ServiceStaff.Add(newServiceStaff);
                        }
                        else
                        {
                            // Update the existing record if found
                            newServiceStaff.Price = newService.Price;
                            newServiceStaff.StaffEarning = newService.Price * (newService.StaffEarningPercentage / 100);

                            _context.ServiceStaff.Update(newServiceStaff);
                        }
                    }
                }
                else if (appointmentDto.Status?.ToLower() == "pa përfunduar" && oldServiceStaff != null)
                {
                    // Remove the old ServiceStaff record if the appointment is marked incomplete
                    _context.ServiceStaff.Remove(oldServiceStaff);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(existingAppointment);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error editing appointment: {ex.Message}");
                return StatusCode(500, "An error occurred while editing the appointment.");
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
        [HttpGet("appointments-completed-by-day")]
        public async Task<IActionResult> GetCompletedAppointmentsByDayForCurrentWeek()
        {
            try
            {
                // Merrni fillimin dhe fundin e javës aktuale (duke filluar nga e Hëna)
                var startOfCurrentWeek = DateTime.Now.StartOfWeek(DayOfWeek.Monday);
                var endOfCurrentWeek = startOfCurrentWeek.AddDays(6);

                // Lista për të mbajtur numrin e terminet e kryera çdo ditë
                var completedAppointmentsData = new List<object>();

                // Kaloni për çdo ditë të javës
                for (int i = 0; i < 7; i++)
                {
                    var currentDate = startOfCurrentWeek.AddDays(i);

                    // Numëroni terminet e përfunduar për këtë ditë
                    var completedAppointmentsCount = await _context.Appointments
                        .Where(a => a.Status.ToLower() == "përfunduar" && a.AppointmentDate.Date == currentDate.Date)
                        .CountAsync();

                    // Shto të dhënat për këtë ditë në listën e përfunduar
                    completedAppointmentsData.Add(new
                    {
                        day = currentDate.ToString("yyyy-MM-dd"),
                        completedAppointments = completedAppointmentsCount
                    });
                }

                // Kthej të dhënat për javën aktuale
                return Ok(completedAppointmentsData);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error calculating completed appointments by day: {ex.Message}");
                return StatusCode(500, "An error occurred while calculating the completed appointments.");
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
        [HttpGet("completed-appointments-client")]
        public async Task<IActionResult> GetCompletedAppointmentsByClient(
       [FromQuery] string firstName,
       [FromQuery] string lastName,
       [FromQuery] string phoneNumber,
       [FromQuery] string email)
        {
            try
            {
                // Validate input
                if (string.IsNullOrEmpty(firstName) || string.IsNullOrEmpty(lastName) ||
                    string.IsNullOrEmpty(phoneNumber) || string.IsNullOrEmpty(email))
                {
                    return BadRequest("Client details must be provided.");
                }

                // Log the input parameters
                Console.WriteLine($"Input Parameters - FirstName: {firstName}, LastName: {lastName}, PhoneNumber: {phoneNumber}, Email: {email}");

                // Fetch completed appointments count
                var completedAppointmentsCount = await _context.Appointments
                    .Include(a => a.Client) // Ensure Client navigation property is loaded
                    .Where(a => a.Status.ToLower() == "përfunduar" &&
                                a.Client != null &&
                                a.Client.FirstName.Trim().ToLower() == firstName.Trim().ToLower() &&
                                a.Client.LastName.Trim().ToLower() == lastName.Trim().ToLower() &&
                                a.Client.PhoneNumber.Trim() == phoneNumber.Trim() &&
                                a.Client.Email.Trim().ToLower() == email.Trim().ToLower())
                    .CountAsync();

                // Log for debugging
                Console.WriteLine($"Completed Appointments Count: {completedAppointmentsCount}");

                return Ok(new
                {
                    FirstName = firstName,
                    LastName = lastName,
                    PhoneNumber = phoneNumber,
                    Email = email,
                    CompletedAppointments = completedAppointmentsCount
                });
            }
            catch (Exception ex)
            {
                // Log detailed error
                Console.WriteLine($"Error fetching completed appointments for client: {ex}");
                return StatusCode(500, "An error occurred while fetching the completed appointments.");
            }
        }

        [HttpGet("appointment-count-weekly")]
        public async Task<IActionResult> GetAppointmentCountWeekly([FromQuery] string period = "month")
        {
            try
            {
                DateTime startDate;
                DateTime endDate;

                // Determine the start and end dates for the period
                if (period.ToLower() == "week")
                {
                    startDate = DateTime.Now.StartOfWeek(DayOfWeek.Monday); // Start of current week
                    endDate = startDate.AddDays(7); // End of current week
                }
                else
                {
                    // Default is month
                    startDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1); // First day of current month
                    endDate = startDate.AddMonths(1).AddDays(-1); // Last day of current month
                }

                // Get the appointment counts for the current week
                var weeklyAppointments = await _context.Appointments
                    .Where(a => a.AppointmentDate >= startDate && a.AppointmentDate <= endDate)
                    .GroupBy(a => new { Week = (int)((a.AppointmentDate.Day - 1) / 7) + 1 }) // Group by week
                    .Select(group => new
                    {
                        Week = group.Key.Week,
                        AppointmentCount = group.Count() // Count appointments per week
                    })
                    .OrderBy(x => x.Week)
                    .ToListAsync();

                return Ok(weeklyAppointments);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching weekly appointment count: {ex.Message}");
                return StatusCode(500, "An error occurred while fetching weekly appointment count.");
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
        [HttpGet("services-completed")]
        public IActionResult GetMostCompletedServices(DateTime startDate, DateTime endDate)
        {
            try
            {
                if (startDate == default || endDate == default || startDate > endDate)
                {
                    return BadRequest("Invalid date range provided.");
                }

                var completedServices = _context.Appointments
                    .Where(a => a.Status == "përfunduar" && a.AppointmentDate >= startDate && a.AppointmentDate <= endDate)
                    .GroupBy(a => a.Service.ServiceName)
                    .Select(g => new { ServiceName = g.Key, Count = g.Count() })
                    .OrderByDescending(g => g.Count)
                    .ToList();

                return Ok(completedServices);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching completed services: {ex.Message}");
                return StatusCode(500, "An error occurred while fetching completed services.");
            }
        }

        [HttpGet("top-customers")]
        public IActionResult GetTopCustomers()
        {
            try
            {
                var topCustomers = _context.Appointments
                    .Where(a => a.Status.ToLower() == "përfunduar") // Only completed appointments
                    .GroupBy(a => new { a.Client.ClientID, a.Client.FirstName, a.Client.LastName, a.Client.PhoneNumber })
                    .Select(group => new
                    {
                        ClientID = group.Key.ClientID,
                        Name = $"{group.Key.FirstName} {group.Key.LastName} - {group.Key.PhoneNumber}",
                        CompletedAppointments = group.Count()
                    })
                    .OrderByDescending(x => x.CompletedAppointments)
                    .Take(10)
                    .ToList();

                return Ok(topCustomers);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching top customers: {ex.Message}");
                return StatusCode(500, "An error occurred while fetching top customers.");
            }
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
