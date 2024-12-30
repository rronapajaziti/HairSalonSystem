using HairSalon.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

[ApiController]
[Route("api/dailyexpenses")]
public class DailyExpensesController : ControllerBase
{
    private readonly MyContext _context;

    public DailyExpensesController(MyContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetExpenses([FromQuery] DateTime? date)
    {
        var expenses = date.HasValue
            ? _context.DailyExpenses.Where(e => e.Date.Date == date.Value.Date).ToList()
            : _context.DailyExpenses.ToList();

        var totalCost = expenses.Sum(e => e.Amount);

        return Ok(new
        {
            Expenses = expenses,
            TotalCost = totalCost
        });
    }

    [HttpPost]
    public IActionResult AddExpense([FromBody] DailyExpense expense)
    {
        _context.DailyExpenses.Add(expense);
        _context.SaveChanges();
        return Ok(expense);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteExpense(int id)
    {
        var expense = _context.DailyExpenses.FirstOrDefault(e => e.Id == id);
        if (expense == null) return NotFound();

        _context.DailyExpenses.Remove(expense);
        _context.SaveChanges();
        return Ok();
    }
}
