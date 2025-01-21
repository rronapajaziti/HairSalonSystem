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
                ss.StaffID == existingAppointment.UserID &&
                ss.DateCompleted == existingAppointment.AppointmentDate);

            Console.WriteLine("Existing Appointment Details:");
            Console.WriteLine($"ServiceID: {existingAppointment.ServiceID}, UserID: {existingAppointment.UserID}, DateCompleted: {existingAppointment.AppointmentDate}");

            // Update appointment details
            existingAppointment.UserID = appointmentDto.UserID;
            existingAppointment.ServiceID = appointmentDto.ServiceID;
            existingAppointment.AppointmentDate = appointmentDto.AppointmentDate;
            existingAppointment.Status = appointmentDto.Status;
            existingAppointment.Notes = appointmentDto.Notes;

            _context.Entry(existingAppointment).State = EntityState.Modified;

            var newService = await _context.Services.FindAsync(appointmentDto.ServiceID);

            if (appointmentDto.Status?.ToLower() == "përfunduar")
            {
                Console.WriteLine("Processing ServiceStaff update...");
                if (oldServiceStaff != null)
                {
                    Console.WriteLine("Updating existing ServiceStaff record...");
                    oldServiceStaff.ServiceID = appointmentDto.ServiceID;
                    oldServiceStaff.StaffID = appointmentDto.UserID;
                    oldServiceStaff.DateCompleted = appointmentDto.AppointmentDate;
                    oldServiceStaff.Price = newService.Price;
                    oldServiceStaff.StaffEarning = newService.Price * (newService.StaffEarningPercentage / 100);

                    _context.ServiceStaff.Update(oldServiceStaff);
                }
                else
                {
                    Console.WriteLine("Creating new ServiceStaff record...");
                    var newServiceStaff = new ServiceStaff
                    {
                        ServiceID = appointmentDto.ServiceID,
                        StaffID = appointmentDto.UserID,
                        DateCompleted = appointmentDto.AppointmentDate,
                        Price = newService.Price,
                        StaffEarning = newService.Price * (newService.StaffEarningPercentage / 100)
                    };

                    _context.ServiceStaff.Add(newServiceStaff);
                }
            }
            else if (appointmentDto.Status?.ToLower() == "pa përfunduar" && oldServiceStaff != null)
            {
                Console.WriteLine("Removing existing ServiceStaff record...");
                _context.ServiceStaff.Remove(oldServiceStaff);
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            Console.WriteLine("Transaction committed successfully.");

            return Ok(existingAppointment);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            Console.WriteLine($"Error editing appointment: {ex.Message}");
            return StatusCode(500, "An error occurred while editing the appointment.");
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
