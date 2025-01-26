import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import userProfilePic from '../images/user/user-06.png';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('profile');
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      navigate('/', { replace: true });
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://api.studio-linda.com/api/User/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setUserInfo({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || '',
          phone: response.data.phoneNumber || '',
          password: '',
          confirmPassword: '',
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      try {
        const response = await axios.get(
          `https://api.studio-linda.com/api/Appointment/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setAppointments(response.data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to fetch appointments.');
      }
    };

    fetchAppointments();
  }, [refreshKey]); // Refresh kur ndryshon refreshKey

  const handleViewSwitch = (newView: 'profile' | 'appointments') => {
    setView(newView);
    if (newView === 'appointments') {
      setRefreshKey((prev) => prev + 1); // Rifresko të dhënat kur kalon tek Terminet
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (userInfo.password && userInfo.password !== userInfo.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        throw new Error('User is not logged in.');
      }

      const payload = {
        userID: parseInt(userId, 10),
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        phoneNumber: userInfo.phone,
        email: userInfo.email,
        ...(userInfo.password && { passwordHash: userInfo.password }),
      };

      const response = await axios.put(
        `https://api.studio-linda.com/api/User/${userId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert('Profile updated successfully!');
    } catch (err: any) {
      console.error(
        'Error updating user data:',
        err.response?.data || err.message,
      );
      alert(
        `Failed to update profile. Error: ${err.response?.data?.message || err.message}`,
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/', { replace: true });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-lg text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
        <div className="text-center py-8">
          <h2 className="text-3xl text-left p-4 font-semibold text-gray-700 dark:text-white">
            {userInfo.firstName} {userInfo.lastName}
          </h2>
        </div>
        <nav className="mt-6 space-y-4 px-4">
          <button
            onClick={() => handleViewSwitch('profile')}
            className={`block w-full px-6 py-3 text-left font-medium transition-colors duration-300 rounded-md ${
              view === 'profile'
                ? 'bg-blue text-white dark:bg-blue-900'
                : 'text-gray hover:bg-white hover text-gray dark:bg-blue-900'
            }`}
          >
            Profili
          </button>
          <button
            onClick={() => handleViewSwitch('appointments')}
            className={`block w-full px-6 py-3 text-left font-medium transition-colors duration-300 rounded-md ${
              view === 'appointments'
                ? 'bg-blue-600 text-white dark:bg-blue-900'
                : 'text-white hover:bg-white-600 hover:text-white dark:bg-blue-900'
            }`}
          >
            Terminet e Mia
          </button>
          <button
            onClick={handleLogout}
            className="block w-full dark:bg-blue-900 px-6 py-3 text-left font-medium text-white hover:bg-blue-600 hover:text-white transition-colors duration-300 rounded-md"
          >
            Dil
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
        {view === 'profile' ? (
          <div className="bg-white p-6 rounded-lg shadow-lg h-1/2 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
            <h2 className="text-xl font-semibold mb-6 dark:text-white">
              Profile
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-600 dark:text-white"
                >
                  Emri
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={userInfo.firstName}
                  onChange={handleChange}
                  readOnly
                  className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:border-strokedark dark:bg-boxdark"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-600  dark:text-white dark:border-strokedark dark:bg-boxdark"
                >
                  Mbiemri
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={userInfo.lastName}
                  readOnly
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userInfo.email}
                  readOnly
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:border-strokedark dark:bg-boxdark"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-600 dark:text-white"
                >
                  Numri i Telefonit
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={userInfo.phone}
                  readOnly
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:border-strokedark dark:bg-boxdark"
                />
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
            <h2 className="text-xl font-semibold mb-6 dark:text-white text-blue-900">
              Terminet e Mija
            </h2>
            {appointments.length === 0 ? (
              <p className="text-gray-600">Nuk ka Termine.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                  <thead className="bg-gray-200 text-gray-600">
                    <tr>
                      <th className="py-2 px-4 text-lefttext-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                        Emri i Klientit
                      </th>
                      <th className="py-2 px-4 text-left text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                        Shërbimi
                      </th>
                      <th className="py-2 px-4 text-left text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                        Data
                      </th>
                      <th className="py-2 px-4 text-left text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                        Statusi
                      </th>
                      <th className="py-2 px-4 text-left text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                        Shënime
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment: any, index) => (
                      <tr
                        key={appointment.appointmentID}
                        className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                      >
                        <td className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">{`${appointment.client?.firstName} ${appointment.client?.lastName}`}</td>
                        <td className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                          {appointment.serviceName || 'No Service'}
                        </td>
                        <td className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                          {new Date(
                            appointment.appointmentDate,
                          ).toLocaleString()}
                        </td>
                        <td className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                          {appointment.status}
                        </td>
                        <td className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                          {appointment.notes || 'No Notes'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
