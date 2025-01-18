using HairSalon.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ServiceStaffController : ControllerBase
{
    private readonly MyContext _context;

    public ServiceStaffController(MyContext context)
    {
        _context = context;
    }

    // Fetch all service staff
    [HttpGet]
    public async Task<IActionResult> GetAllServiceStaff()
    {
        try
        {
            var staff = await _context.ServiceStaff
                .Include(ss => ss.User)
                .Include(ss => ss.Service)
                .Select(ss => new
                {
                    ss.ServiceStaffID,
                    StaffName = ss.User != null ? $"{ss.User.FirstName} {ss.User.LastName}" : "Unknown Staff",
                    ServiceName = ss.Service != null ? ss.Service.ServiceName : "Unknown Service",
                    ServicePrice = ss.Price,
                    Percentage = ss.Price > 0 ? (ss.StaffEarning / ss.Price) * 100 : 0, // Handle divide by zero
                    StaffEarning = ss.StaffEarning,
                    DateCompleted = ss.DateCompleted
                })
                .ToListAsync();

            return Ok(staff);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching service staff: {ex.Message}");
            return StatusCode(500, "An error occurred while fetching service staff data.");
        }
    }

    // Create or update ServiceStaff based on Appointment changes
    [HttpPost("sync-from-appointment")]
    public async Task<IActionResult> SyncServiceStaffFromAppointment([FromBody] Appointment appointment)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var service = await _context.Services.FindAsync(appointment.ServiceID);
            if (service == null)
                return BadRequest("Invalid Service ID.");

            // Check if the appointment is completed
            if (appointment.Status?.ToLower() == "përfunduar")
            {
                // Check if a ServiceStaff record already exists for this appointment
                var existingServiceStaff = await _context.ServiceStaff
                    .FirstOrDefaultAsync(ss =>
                        ss.ServiceID == appointment.ServiceID &&
                        ss.StaffID == appointment.UserID &&
                        ss.DateCompleted == appointment.AppointmentDate);

                if (existingServiceStaff == null)
                {
                    // Create a new ServiceStaff recorda
                    var newServiceStaff = new ServiceStaff
                    {
                        ServiceID = appointment.ServiceID,
                        StaffID = appointment.UserID,
                        DateCompleted = appointment.AppointmentDate,
                        Price = service.Price,
                        StaffEarning = service.Price * (service.StaffEarningPercentage / 100)
                    };

                    _context.ServiceStaff.Add(newServiceStaff);
                }
                else
                {
                    // Update existing ServiceStaff record
                    existingServiceStaff.DateCompleted = appointment.AppointmentDate;
                    existingServiceStaff.Price = service.Price;
                    existingServiceStaff.StaffEarning = service.Price * (service.StaffEarningPercentage / 100);
                    _context.ServiceStaff.Update(existingServiceStaff);
                }

                await _context.SaveChangesAsync();
            }

            return Ok("ServiceStaff synced successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error syncing ServiceStaff: {ex.Message}");
            return StatusCode(500, "An error occurred while syncing ServiceStaff data.");
        }
    }

    // Get daily earnings
    [HttpGet("daily-earnings")]
    public async Task<IActionResult> GetDailyEarnings()
    {
        try
        {
            var dailyEarnings = await _context.ServiceStaff
                .Include(ss => ss.User)
                .GroupBy(ss => new
                {
                    ss.StaffID,
                    ss.User.FirstName,
                    ss.User.LastName,
                    Day = ss.DateCompleted.Day,
                    Month = ss.DateCompleted.Month,
                    Year = ss.DateCompleted.Year
                })
                .Select(group => new
                {
                    StaffID = group.Key.StaffID,
                    StaffName = $"{group.Key.FirstName} {group.Key.LastName}",
                    Day = group.Key.Day,
                    Month = group.Key.Month,
                    Year = group.Key.Year,
                    TotalEarnings = group.Sum(ss => ss.StaffEarning)
                })
                .OrderBy(x => x.StaffID)
                .ThenBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ThenBy(x => x.Day)
                .ToListAsync();

            return Ok(dailyEarnings);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error calculating daily earnings: {ex.Message}");
            return StatusCode(500, "An error occurred while calculating daily earnings.");
        }
    }

    // Delete ServiceStaff record
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteServiceStaff(int id)
    {
        try
        {
            var serviceStaff = await _context.ServiceStaff.FindAsync(id);
            if (serviceStaff == null)
                return NotFound("ServiceStaff record not found.");

            _context.ServiceStaff.Remove(serviceStaff);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error deleting ServiceStaff record: {ex.Message}");
            return StatusCode(500, "An error occurred while deleting the ServiceStaff record.");
        }
    }
}
