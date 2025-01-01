import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';

const MonthlyExpenses = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7), // Default to current year and month
  );
  const [totalCost, setTotalCost] = useState<number>(0);
  const [showForm, setShowForm] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);

  const [newExpense, setNewExpense] = useState({ name: '', amount: '' });
  const [editFormData, setEditFormData] = useState({
    id: null,
    name: '',
    amount: '',
    date: '',
  });

  useEffect(() => {
    fetchMonthlyExpenses();
  }, [selectedMonth]);

  const fetchMonthlyExpenses = async () => {
    const [year, month] = selectedMonth.split('-');
    try {
      const response = await axios.get('https://localhost:7158/api/monthlyexpenses', {
        params: { year, month },
      });
      setExpenses(response.data.expenses || []);
      setTotalCost(response.data.totalCost || 0);
    } catch (error) {
      console.error('Error fetching monthly expenses:', error);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: newExpense.name,
        amount: parseFloat(newExpense.amount),
        date: `${selectedMonth}-01`, // Ensure the date is for the selected month
      };

      const response = await axios.post('https://localhost:7158/api/monthlyexpenses', payload);
      setExpenses((prev) => [...prev, response.data]);
      setNewExpense({ name: '', amount: '' });
      setShowForm(false);
      fetchMonthlyExpenses();
    } catch (error) {
      console.error('Error adding monthly expense:', error);
    }
  };

  const handleEdit = (expense: any) => {
    if (editingExpenseId === expense.id) {
      setEditingExpenseId(null);
    } else {
      setEditingExpenseId(expense.id);
      setEditFormData({
        id: expense.id,
        name: expense.name,
        amount: expense.amount,
        date: expense.date,
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        id: editFormData.id,
        name: editFormData.name,
        amount: parseFloat(editFormData.amount),
        date: editFormData.date,
      };

      const response = await axios.put(
        `https://localhost:7158/api/monthlyexpenses/${editFormData.id}`,
        payload,
      );
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === payload.id ? response.data : expense,
        ),
      );
      setEditingExpenseId(null);
      fetchMonthlyExpenses();
    } catch (error) {
      console.error('Error editing monthly expense:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://localhost:7158/api/monthlyexpenses/${id}`);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      fetchMonthlyExpenses();
    } catch (error) {
      console.error('Error deleting monthly expense:', error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-blue-900 dark:text-white">
          Shpenzimet Mujore
        </h1>
        <div className="flex items-center">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border rounded-md mr-4 text-black dark:text-white"
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            {showForm ? 'X' : 'Shto Shpenzimin'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAddExpense} className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Emri i Shpenzimit</label>
              <input
                type="text"
                name="name"
                value={newExpense.name}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, name: e.target.value })
                }
                className="px-4 py-2 border rounded-md w-full"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Çmimi (€)</label>
              <input
                type="number"
                name="amount"
                value={newExpense.amount}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, amount: e.target.value })
                }
                className="px-4 py-2 border rounded-md w-full"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Shto
          </button>
        </form>
      )}

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">Emri i Shpenzimit</th>
            <th className="py-2 px-4 text-left">Çmimi (€)</th>
            <th className="py-2 px-4 text-left">Data</th>
            <th className="py-2 px-4 text-left">Veprimet</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <React.Fragment key={expense.id}>
              <tr>
                <td>{expense.name}</td>
                <td>{expense.amount.toFixed(2)}€</td>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleEdit(expense)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    <MdOutlineDelete />
                  </button>
                </td>
              </tr>
              {editingExpenseId === expense.id && (
                <tr>
                  <td colSpan={4}>
                    <form onSubmit={handleEditSubmit} className="py-4 px-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label>Emri i Shpenzimit</label>
                          <input
                            type="text"
                            name="name"
                            value={editFormData.name}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                name: e.target.value,
                              })
                            }
                            className="px-4 py-2 border rounded-md w-full"
                            required
                          />
                        </div>
                        <div>
                          <label>Çmimi (€)</label>
                          <input
                            type="number"
                            name="amount"
                            value={editFormData.amount}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                amount: e.target.value,
                              })
                            }
                            className="px-4 py-2 border rounded-md w-full"
                            required
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                      >
                        Ruaj
                      </button>
                    </form>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="py-4 px-6 font-bold">Totali</td>
            <td className="py-2 px-4 font-bold">{totalCost.toFixed(2)}€</td>
            <td colSpan={2}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default MonthlyExpenses;
