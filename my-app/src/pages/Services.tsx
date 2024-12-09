import React, { useState } from 'react';

const serviceData = [
  { name: 'Veullat Microblading', price: 100, status: 'Available' },
  { name: 'Vs1 & Vs2', price: 50, status: 'Available' },
  { name: 'Piko Laser per Vetulla', price: 80, status: 'Available' },
  { name: 'Tretmanet e Fytyres', price: 70, status: 'Available' },
  { name: 'Vetullat Browlamination', price: 90, status: 'Unavailable' },
  { name: 'Lash Lift', price: 60, status: 'Available' },
  { name: 'Formsim i Vetullave', price: 40, status: 'Available' },
  { name: 'Qerpikt Mbjellje', price: 120, status: 'Unavailable' },
  { name: 'Clasik', price: 30, status: 'Available' },
  { name: 'Volum', price: 35, status: 'Available' },
  { name: 'Depilim Komplet Trupit', price: 150, status: 'Available' },
  { name: 'Sprey Ten', price: 40, status: 'Available' },
  { name: 'Pedikyr', price: 50, status: 'Available' },
  { name: 'Manikyre', price: 45, status: 'Available' },
  { name: 'Thojt Natural', price: 25, status: 'Available' },
  { name: 'Thojt Zgjatje', price: 60, status: 'Available' },
  { name: 'Dizajn Psrafin', price: 30, status: 'Available' },
  { name: 'Flok', price: 100, status: 'Available' },
  { name: 'Frizura', price: 75, status: 'Available' },
  { name: 'Grimi', price: 90, status: 'Available' },
];

const Services = () => {
  const [services, setServices] = useState(serviceData);
  const [showForm, setShowForm] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    price: 0,
    status: 'Available',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServices((prev) => [...prev, newService]);
    setShowForm(false);
    setNewService({
      name: '',
      price: 0,
      status: 'Available',
    });
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold dark:text-dark">Shërbimet</h3>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? 'Cancel' : 'Add Service'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 p-4 border border-gray-300 rounded-md"
        >
          <div className="mb-4">
            <label className="block dark:text-dark" htmlFor="name">
              Emri i shërbimit
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newService.name}
              onChange={handleChange}
              className="w-full p-2 border dark:border-strokedark dark:bg-boxdark dark:text-dark"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block dark:text-dark" htmlFor="price">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={newService.price}
              onChange={handleChange}
              className="w-full p-2 border dark:border-strokedark dark:bg-boxdark dark:text-dark"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block dark:text-dark" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={newService.status}
              onChange={handleChange}
              className="w-full p-2 border dark:border-strokedark dark:bg-boxdark dark:text-dark"
              required
            >
              <option value="Available">I Disponueshëm</option>
              <option value="Unavailable">I Padisponueshëm</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-300 text-white rounded-md"
          >
            shto sherbimin
          </button>
        </form>
      )}

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-dark xl:pl-11">
                Sherbimi
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-dark">
                Cmimi
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-dark">
                Statusi
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-dark">
                Aksionet
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={index} className="border-b dark:border-strokedark">
                <td className="py-4 px-4 text-dark">{service.name}</td>
                <td className="py-4 px-4 text-dark">{service.price} €</td>
                <td className="py-4 px-4 text-dark">{service.status}</td>
                <td className="py-4 px-4">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-blue-400 text-white rounded-md ml-2">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Services;
