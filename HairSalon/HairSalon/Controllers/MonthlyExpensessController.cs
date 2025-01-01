using HairSalon.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

[ApiController]
[Route("api/monthlyexpenses")]
public class MonthlyExpensesController : ControllerBase
{
    private readonly MyContext _context;

    public MonthlyExpensesController(MyContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetMonthlyExpenses([FromQuery] int year, [FromQuery] int month)
    {
        // Fetch expenses specific to MonthlyExpenses
        var expenses = _context.MonthlyExpenses
            .Where(e => e.Date.Year == year && e.Date.Month == month)
            .ToList();
    
        var totalCost = expenses.Sum(e => e.Amount);
    
        return Ok(new { Expenses = expenses, TotalCost = totalCost });
    }
    
    [HttpPost]
    public IActionResult AddMonthlyExpense([FromBody] MonthlyExpenses expense)
    {
        _context.MonthlyExpenses.Add(expense); // Add to MonthlyExpenses table
        _context.SaveChanges();
        return Ok(expense);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteMonthlyExpense(int id)
    {
        var expense = _context.MonthlyExpenses.FirstOrDefault(e => e.Id == id);
        if (expense == null)
        {
            return NotFound("Expense not found.");
        }

        _context.MonthlyExpenses.Remove(expense);
        _context.SaveChanges();

        return Ok("Expense deleted successfully.");
    }
}
