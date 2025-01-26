using HairSalon.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ServiceController : ControllerBase
{
    private readonly MyContext _context;

    public ServiceController(MyContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetServices()
    {
        var services = await _context.Services
            .Include(s => s.ServiceDiscounts)
            .ToListAsync();

        var response = services.Select(s => new
        {
            s.ServiceID,
            s.ServiceName,
            s.Description,
            s.Price,
            s.DiscountPrice,
            s.Duration,
            s.StaffEarningPercentage
        });

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> CreateService([FromBody] Service service)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        _context.Services.Add(service);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetServices), new { id = service.ServiceID }, service);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> EditService(int id, [FromBody] Service serviceDto)
    {
        if (id != serviceDto.ServiceID)
            return BadRequest("Service ID mismatch.");

        var existingService = await _context.Services
            .Include(s => s.ServiceStaff) // Include ServiceStaff for updates
            .FirstOrDefaultAsync(s => s.ServiceID == id);

        if (existingService == null)
            return NotFound("Service not found.");

        try
        {
            // Update service details
            existingService.ServiceName = serviceDto.ServiceName;
            existingService.Description = serviceDto.Description;
            existingService.Price = serviceDto.Price;
            existingService.DiscountPrice = serviceDto.DiscountPrice;
            existingService.Duration = serviceDto.Duration;
            existingService.StaffEarningPercentage = serviceDto.StaffEarningPercentage;

            // Loop through each ServiceStaff associated with the service and update the StaffEarning
            foreach (var serviceStaff in existingService.ServiceStaff)
            {
                serviceStaff.Price = serviceDto.Price;
                serviceStaff.StaffEarning = serviceDto.Price * (serviceDto.StaffEarningPercentage / 100);
            }

            _context.Entry(existingService).State = EntityState.Modified;

            // Save changes
            await _context.SaveChangesAsync();

            return Ok(existingService); // Return the updated service along with updated ServiceStaff
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error editing service: {ex.Message}");
            return StatusCode(500, "An error occurred while editing the service.");
        }
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteService(int id)
    {
        var service = await _context.Services.FindAsync(id);
        if (service == null)
            return NotFound();

        _context.Services.Remove(service);
        await _context.SaveChangesAsync();

        return NoContent();
    }
    [HttpGet("total-services")]
    public async Task<IActionResult> GetTotalServices()
    {
        try
        {
            var totalServices = await _context.Services.CountAsync();
            return Ok(new { totalServices });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching total services: {ex.Message}");
            return StatusCode(500, "An error occurred while fetching total services.");
        }
    }

}
