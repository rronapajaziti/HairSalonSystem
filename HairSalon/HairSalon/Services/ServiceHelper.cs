using HairSalon.Models;
using Microsoft.EntityFrameworkCore;

public class ServiceHelper
{
    private readonly MyContext _context;

    public ServiceHelper(MyContext context)
    {
        _context = context;
    }

    public async Task UpdateServicePrice(int serviceID)
    {
        var service = await _context.Services
            .Include(s => s.ServiceDiscounts)
            .FirstOrDefaultAsync(s => s.ServiceID == serviceID);

        if (service == null) return;

        var now = DateTime.UtcNow;
        var activeDiscount = service.ServiceDiscounts.FirstOrDefault(
            d => d.StartDate <= now && d.EndDate >= now
        );

        service.Price = activeDiscount != null
            ? service.Price - (service.Price * activeDiscount.DiscountPercentage / 100)
            : service.Price;

        _context.Entry(service).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }
}
