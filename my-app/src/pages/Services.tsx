import React from 'react';

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
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-dark xl:pl-11">
                Sherbimi
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black  dark:text-dark">
                Cmimi
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black  dark:text-dark">
                Statusi
              </th>
              <th className="py-4 px-4 font-medium text-black  dark:text-dark">
                Aksionet
              </th>
            </tr>
          </thead>
          <tbody>
            {serviceData.map((service, index) => (
              <tr
                key={index}
                className="border-b border-[#eee] dark:border-strokedark"
              >
                <td className="py-5 px-4 pl-9  dark:text-dark">
                  {service.name}
                </td>
                <td className="py-5 px-4">{service.price} €</td>
                <td className="py-5 px-4">
                  <span
                    className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${
                      service.status === 'Available'
                        ? 'bg-success text-success'
                        : service.status === 'Unavailable'
                          ? 'bg-danger text-danger'
                          : ''
                    }`}
                  >
                    {service.status}
                  </span>
                </td>
                <td className="py-5 px-4">
                  <div className="flex gap-2">
                    <button className="bg-blue-300 hover:bg-blue-700 text-white py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                      Edit
                    </button>
                    <button className="bg-blue-400 hover:bg-green-700 text-white py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                      Delete
                    </button>
                  </div>
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
