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



    [HttpPost]
    public async Task<IActionResult> CreateServiceStaff([FromBody] ServiceStaff serviceStaff)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        // Fetch the service to calculate the price and earnings
        var service = await _context.Services.FindAsync(serviceStaff.ServiceID);
        if (service == null)
        {
            return BadRequest("Invalid Service ID.");
        }

        // Calculate earnings based on the service price and percentage
        serviceStaff.Price = service.Price;
        serviceStaff.StaffEarning = service.Price * (service.StaffEarningPercentage / 100);

        _context.ServiceStaff.Add(serviceStaff);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAllServiceStaff), new { id = serviceStaff.ServiceStaffID }, serviceStaff);
    }
    [HttpGet("monthly-earnings")]
    public async Task<IActionResult> GetMonthlyEarnings()
    {
        try
        {
            var monthlyEarnings = await _context.ServiceStaff
                .Include(ss => ss.User)
                .GroupBy(ss => new
                {
                    ss.StaffID,
                    ss.User.FirstName,
                    ss.User.LastName,
                    Month = ss.DateCompleted.Month,
                    Year = ss.DateCompleted.Year
                })
                .Select(group => new
                {
                    StaffID = group.Key.StaffID,
                    StaffName = $"{group.Key.FirstName} {group.Key.LastName}",
                    Month = group.Key.Month,
                    Year = group.Key.Year,
                    TotalEarnings = group.Sum(ss => ss.StaffEarning)
                })
                .OrderBy(x => x.StaffID)
                .ThenBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToListAsync();

            return Ok(monthlyEarnings);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error calculating monthly earnings: {ex.Message}");
            return StatusCode(500, "An error occurred while calculating monthly earnings.");
        }
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteServiceStaff(int id)
    {
        try
        {
            var serviceStaff = await _context.ServiceStaff.FindAsync(id);
            if (serviceStaff == null)
            {
                return NotFound("ServiceStaff record not found.");
            }

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
