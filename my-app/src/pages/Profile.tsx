import React, { useState } from 'react';
import userProfilePic from '../images/user/user-06.png';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: 'Laida',
    lastName: 'Rusinovci',
    email: 'laida.1@example.com',
    phone: '123-456-7890',
  });
  const [activeSection, setActiveSection] = useState('profile');

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      date: '2024-12-18',
      time: '10:00 AM',
      description: 'Appointment1',
    },
    { id: 2, date: '2024-12-20', time: '2:00 PM', description: 'Appointment2' },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    console.log('Form submitted', userInfo);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray text-black p-8 rounded-l-xl shadow-lg dark:text-white">
        <div className="text-center mb-8 dark:text-white">
          <img
            src={userProfilePic}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white "
          />
          <h2 className="text-2xl font-semibold dark:text-white">Laida</h2>
          <p className="">Web Developer</p>
        </div>
        <nav className="flex flex-col space-y-6 text-lg">
          <a
            href="#"
            className={`hover:text-blue-500 transition duration-300 ${activeSection === 'profile' ? 'text-blue-500' : ''}`}
            onClick={() => setActiveSection('profile')}
          >
            Profile
          </a>
          <a
            href="#"
            className={`hover:text-blue-500 transition duration-300 ${activeSection === 'appointments' ? 'text-blue-500' : ''}`}
            onClick={() => setActiveSection('appointments')}
          >
            Appointments
          </a>
          <a
            href="/settings"
            className="hover:text-blue-500 transition duration-300"
          >
            Settings
          </a>
          <a
            href="/logout"
            className="hover:text-blue-500 transition duration-300"
          >
            Logout
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-10 space-y-6 bg-white rounded-r-xl shadow-xl  dark:border-strokedark dark:bg-boxdark dark:text-white">
        {activeSection === 'profile' && (
          <>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">
              Edit Profile
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col">
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-600 dark:text-white"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={userInfo.firstName}
                  onChange={handleChange}
                  className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500  dark:border-strokedark dark:bg-boxdark dark:text-white"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-600 dark:text-white"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={userInfo.lastName}
                  onChange={handleChange}
                  className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none  dark:border-strokedark dark:bg-boxdark dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-600 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleChange}
                  className="mt-1 p-3 border border-gray-300  dark:border-strokedark dark:bg-boxdark dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-600 dark:text-white"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleChange}
                  className="mt-1 p-3 border border-gray-300 rounded-md  dark:border-strokedark dark:bg-boxdark dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </>
        )}

        {activeSection === 'appointments' && (
          <>
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">
              Appointments
            </h2>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-gray-100 p-4 rounded-md shadow-sm"
                >
                  <p className="font-medium text-gray-800">
                    {appointment.description}
                  </p>
                  <p className="text-gray-600">
                    {appointment.date} at {appointment.time}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
