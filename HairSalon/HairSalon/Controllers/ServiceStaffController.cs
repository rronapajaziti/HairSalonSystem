using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HairSalon.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HairSalon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceStaffController : ControllerBase
    {
        private readonly MyContext _context;

        public ServiceStaffController(MyContext context)
        {
            _context = context;
        }

        // GET: api/ServiceStaff
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceStaff>>> GetAllServiceStaff()
        {
            return await _context.ServiceStaff
                .Include(ss => ss.User)
                .Include(ss => ss.Service)
                .Include(ss => ss.Appointment)
                .ToListAsync();
        }

        // GET: api/ServiceStaff/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceStaff>> GetServiceStaff(int id)
        {
            var serviceStaff = await _context.ServiceStaff
                .Include(ss => ss.User)
                .Include(ss => ss.Service)
                .Include(ss => ss.Appointment)
                .FirstOrDefaultAsync(ss => ss.ServiceStaffID == id);

            if (serviceStaff == null)
            {
                return NotFound();
            }

            return serviceStaff;
        }

        // POST: api/ServiceStaff
        [HttpPost]
        public async Task<ActionResult<ServiceStaff>> AddServiceStaff(ServiceStaff serviceStaff)
        {
            _context.ServiceStaff.Add(serviceStaff);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetServiceStaff", new { id = serviceStaff.ServiceStaffID }, serviceStaff);
        }

        // PUT: api/ServiceStaff/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateServiceStaff(int id, ServiceStaff serviceStaff)
        {
            if (id != serviceStaff.ServiceStaffID)
            {
                return BadRequest();
            }

            _context.Entry(serviceStaff).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceStaffExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/ServiceStaff/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServiceStaff(int id)
        {
            var serviceStaff = await _context.ServiceStaff.FindAsync(id);
            if (serviceStaff == null)
            {
                return NotFound();
            }

            _context.ServiceStaff.Remove(serviceStaff);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ServiceStaffExists(int id)
        {
            return _context.ServiceStaff.Any(e => e.ServiceStaffID == id);
        }
    }
}
