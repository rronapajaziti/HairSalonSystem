import React from 'react';

const staffData = [
  { name: 'Arta Beqiri', role: 'Manager', status: 'Active' },
  { name: 'Liridona Krasniqi', role: 'Receptionist', status: 'Active' },
  { name: 'Blerta Gashi', role: 'Hair Stylist', status: 'On Leave' },
  { name: 'Leonora Hoxha', role: 'Makeup Artist', status: 'Active' },
  { name: 'Valbona Dervishi', role: 'Nail Technician', status: 'Active' },
];

const Staff = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-dark xl:pl-11">
                Emri i Stafit
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-dark">
                Roli
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-dark">
                Statusi
              </th>
            </tr>
          </thead>
          <tbody>
            {staffData.map((staff, index) => (
              <tr
                key={index}
                className="border-b border-stroke dark:border-strokedark"
              >
                <td className="py-4 px-4 text-black dark:text-dark xl:pl-11">
                  {staff.name}
                </td>
                <td className="py-4 px-4 text-black dark:text-dark">
                  {staff.role}
                </td>
                <td
                  className={`py-4 px-4 font-medium ${
                    staff.status === 'Active'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {staff.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Staff;
