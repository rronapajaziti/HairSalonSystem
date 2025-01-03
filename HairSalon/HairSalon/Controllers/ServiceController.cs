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
    public async Task<IActionResult> EditService(int id, [FromBody] Service service)
    {
        if (id != service.ServiceID)
            return BadRequest("ID mismatch.");

        var existingService = await _context.Services.FindAsync(id);
        if (existingService == null)
            return NotFound();

        existingService.ServiceName = service.ServiceName;
        existingService.Description = service.Description;
        existingService.Price = service.Price;
        existingService.DiscountPrice = service.DiscountPrice;
        existingService.Duration = service.Duration;
        existingService.StaffEarningPercentage = service.StaffEarningPercentage;

        _context.Entry(existingService).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
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
}
