using HairSalon.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ServiceDiscountController : ControllerBase
{
    private readonly MyContext _context;

    public ServiceDiscountController(MyContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetDiscounts()
    {
        var discounts = await _context.ServiceDiscounts
            .Include(d => d.Services)
            .ToListAsync();

        return Ok(discounts.Select(d => new
        {
            d.ServiceDiscountID,
            ServiceIDs = d.Services.Select(s => s.ServiceID).ToList(),
            d.StartDate,
            d.EndDate,
            d.DiscountPercentage
        }));
    }

    [HttpPost]
    public async Task<IActionResult> CreateDiscount([FromBody] ServiceDiscount discount)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var services = await _context.Services
            .Where(s => discount.ServiceIDs.Contains(s.ServiceID))
            .ToListAsync();

        if (!services.Any()) return BadRequest("Invalid services specified.");

        discount.Services = services;

        _context.ServiceDiscounts.Add(discount);
        await _context.SaveChangesAsync();

        UpdateDiscountedPrices(discount.ServiceIDs);

        return CreatedAtAction(nameof(GetDiscounts), new { id = discount.ServiceDiscountID }, discount);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> EditDiscount(int id, [FromBody] ServiceDiscount discount)
    {
        if (id != discount.ServiceDiscountID) return BadRequest("ID mismatch.");

        var existingDiscount = await _context.ServiceDiscounts
            .Include(d => d.Services)
            .FirstOrDefaultAsync(d => d.ServiceDiscountID == id);

        if (existingDiscount == null) return NotFound();

        existingDiscount.StartDate = discount.StartDate;
        existingDiscount.EndDate = discount.EndDate;
        existingDiscount.DiscountPercentage = discount.DiscountPercentage;

        var services = await _context.Services
            .Where(s => discount.ServiceIDs.Contains(s.ServiceID))
            .ToListAsync();

        if (!services.Any()) return BadRequest("Invalid services specified.");

        existingDiscount.Services = services;

        await _context.SaveChangesAsync();

        UpdateDiscountedPrices(discount.ServiceIDs);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDiscount(int id)
    {
        var discount = await _context.ServiceDiscounts
            .Include(d => d.Services)
            .FirstOrDefaultAsync(d => d.ServiceDiscountID == id);

        if (discount == null) return NotFound();

        var serviceIDs = discount.Services.Select(s => s.ServiceID).ToList();

        _context.ServiceDiscounts.Remove(discount);
        await _context.SaveChangesAsync();

        UpdateDiscountedPrices(serviceIDs);

        return NoContent();
    }

    private void UpdateDiscountedPrices(IEnumerable<int> serviceIDs)
    {
        var now = DateTime.UtcNow;
        var services = _context.Services
            .Include(s => s.ServiceDiscounts)
            .Where(s => serviceIDs.Contains(s.ServiceID))
            .ToList();

        foreach (var service in services)
        {
            var activeDiscount = service.ServiceDiscounts
                .FirstOrDefault(d => d.StartDate <= now && d.EndDate >= now);

            service.DiscountPrice = activeDiscount != null
                ? service.Price - (service.Price * activeDiscount.DiscountPercentage / 100)
                : 0;

            _context.Entry(service).State = EntityState.Modified;
        }

        _context.SaveChanges();
    }
}
