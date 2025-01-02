using Microsoft.AspNetCore.Mvc; // For IActionResult, FromBody, HttpDelete, etc.
using Microsoft.EntityFrameworkCore; // For EF Core functionalities
using HairSalon.Models; // Ensure it includes the ServiceDiscount model
using System.Threading.Tasks; // For async methods
using System.Linq; // For LINQ queries


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
        var now = DateTime.UtcNow;
        var activeDiscounts = await _context.ServiceDiscounts
            .Include(d => d.Service)
            .Where(d => d.StartDate <= now && d.EndDate >= now)
            .ToListAsync();
        return Ok(activeDiscounts);
    }


 [HttpPost]
public async Task<IActionResult> CreateDiscount([FromBody] ServiceDiscount discount)
{
    try
    {
        // Ensure the service exists
        var serviceExists = await _context.Services.AnyAsync(s => s.ServiceID == discount.ServiceID);
        if (!serviceExists)
            return BadRequest($"ServiceID {discount.ServiceID} does not exist.");

        // Add the discount to the database
        _context.ServiceDiscounts.Add(discount);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetDiscounts), new { id = discount.ServiceDiscountID }, discount);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
        return StatusCode(500, $"Internal Server Error: {ex.Message}");
    }
}





    [HttpPut("{id}")]
    public async Task<IActionResult> EditDiscount(int id, [FromBody] ServiceDiscount discount)
    {
        if (id != discount.ServiceDiscountID) return BadRequest("ID mismatch.");

        var existingDiscount = await _context.ServiceDiscounts.FindAsync(id);
        if (existingDiscount == null) return NotFound("Discount not found.");

        existingDiscount.StartDate = discount.StartDate;
        existingDiscount.EndDate = discount.EndDate;
        existingDiscount.DiscountPercentage = discount.DiscountPercentage;
        existingDiscount.ServiceID = discount.ServiceID;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDiscount(int id)
    {
        var discount = await _context.ServiceDiscounts.FindAsync(id);
        if (discount == null) return NotFound();

        _context.ServiceDiscounts.Remove(discount);
        await _context.SaveChangesAsync();
        return NoContent();
    }




}
