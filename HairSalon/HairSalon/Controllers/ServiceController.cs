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
        var services = await _context.Services.ToListAsync();
        return Ok(services);
    }

    [HttpPost]
    public async Task<IActionResult> CreateService([FromBody] Service service)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        _context.Services.Add(service);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetServices), new { id = service.ServiceID }, service);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> EditService(int id, [FromBody] Service service)
    {
        if (id != service.ServiceID)
            return BadRequest("ID mismatch.");

        var existingService = await _context.Services.FindAsync(id);
        if (existingService == null)
            return NotFound("Service not found.");

        try
        {
            // Update the service details
            existingService.ServiceName = service.ServiceName;
            existingService.Description = service.Description;
            existingService.Price = service.Price;
            existingService.Duration = service.Duration;
            existingService.StaffEarningPercentage = service.StaffEarningPercentage;

            _context.Entry(existingService).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            // Update related ServiceStaff records
            var relatedServiceStaff = await _context.ServiceStaff
                .Where(ss => ss.ServiceID == id)
                .ToListAsync();

            foreach (var staff in relatedServiceStaff)
            {
                staff.Price = existingService.Price; // Ensure Price is in sync
                staff.StaffEarning = existingService.Price * (existingService.StaffEarningPercentage / 100);
                _context.ServiceStaff.Update(staff);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error updating service: {ex.Message}");
            return StatusCode(500, "An error occurred while updating the service.");
        }
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteService(int id)
    {
        var service = await _context.Services.FindAsync(id);
        if (service == null) return NotFound();

        _context.Services.Remove(service);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
