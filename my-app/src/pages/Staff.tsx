import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Staff = () => {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    //beje qe vetem admin mundet me ndrru
    password: '',
    roleID: 3,
  });

  useEffect(() => {
    axios
      .get('https://localhost:7158/api/User')
      .then((response) => {
        setStaffList(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching staff!', error);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStaff({
      ...newStaff,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post('https://localhost:7158/api/Staff', newStaff)
      .then((response) => {
        setStaffList([...staffList, response.data]);
        setShowForm(false);
      })
      .catch((error) => {
        console.error('There was an error adding the staff!', error);
      });
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold dark:text-white">Stafi</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {showForm ? 'X' : 'Shto Stafin'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-white"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First Name"
                value={newStaff.firstName}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border border-gray-300  dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-white"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                value={newStaff.lastName}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border border-gray-300  dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-white"
                htmlFor="phoneNumber"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Phone Number"
                value={newStaff.phoneNumber}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border border-gray-300 dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-white"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={newStaff.email}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border border-gray-300 dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-white"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={newStaff.password}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border border-gray-300 dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
          >
            Add Staff
          </button>
        </form>
      )}

      <div className="max-w-full overflow-x-auto mt-6">
        <table className="w-full table-auto dark:border-strokedark dark:bg-boxdark">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="min-w-[220px] py-4 px-4   text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark xl:pl-11">
                Emri dhe Mbiemri
              </th>
              <th className="min-w-[120px] py-4 px-4  text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Numri i telefonit
              </th>
              <th className="min-w-[120px] py-4 px-4  text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Email
              </th>

              <th className="py-4 px-4   text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Aksionet
              </th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff, index) => (
              <tr key={index}>
                <td className="py-4 px-4 dark:text-white">
                  {staff.firstName} {staff.lastName}
                </td>
                <td className="py-4 px-4 dark:text-white">
                  {staff.phoneNumber}
                </td>
                <td className="py-4 px-4 dark:text-white">{staff.email}</td>

                <td className="py-4 px-4 text-black dark:text-dark">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                    Edit
                  </button>
                  <button className="ml-2 px-4 py-2 bg-blue-400 text-white rounded-md">
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

export default Staff;
