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
  const [view, setView] = useState('profile'); // "profile" or "appointments"
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      navigate('/signin');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://localhost:7158/api/User/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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

  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
      const response = await axios.get(`https://localhost:7158/api/Appointment/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppointments(response.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to fetch appointments.');
    }
  };

  const handleViewSwitch = (newView: 'profile' | 'appointments') => {
    setView(newView);
    if (newView === 'appointments') {
      fetchAppointments();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
  
    // Validate passwords
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
  
      // Prepare payload with conditional inclusion of password
      const payload = {
        userID: parseInt(userId, 10),
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        phoneNumber: userInfo.phone,
        email: userInfo.email,
        ...(userInfo.password && { passwordHash: userInfo.password }), // Only include passwordHash if provided
      };
  
      const response = await axios.put(
        `https://localhost:7158/api/User/${userId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert('Profile updated successfully!');
    } catch (err:any) {
      console.error('Error updating user data:', err.response?.data || err.message);
      alert(`Failed to update profile. Error: ${err.response?.data?.message || err.message}`);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/signin');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-lg">
        <div className="text-center py-8">
          <img
            src={userProfilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-500"
          />
          <h2 className="text-lg font-semibold text-gray-700">
            {userInfo.firstName} {userInfo.lastName}
          </h2>
          <p className="text-sm text-gray-500">Web Developer</p>
        </div>
        <nav className="mt-6 space-y-4 px-4">
          <button
            onClick={() => handleViewSwitch('profile')}
            className={`block w-full px-6 py-3 text-left font-medium transition-colors duration-300 rounded-md ${
              view === 'profile'
                ? 'bg-blue text-white'
                : 'text-gray hover:bg-white hover text-gray'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => handleViewSwitch('appointments')}
            className={`block w-full px-6 py-3 text-left font-medium transition-colors duration-300 rounded-md ${
              view === 'appointments'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-white-600 hover:text-white'
            }`}
          >
            Appointments
          </button>
          <button
            onClick={handleLogout}
            className="block w-full px-6 py-3 text-left font-medium text-gray-700 hover:bg-blue-600 hover:text-white transition-colors duration-300 rounded-md"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {view === 'profile' ? (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-600">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={userInfo.firstName}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-600">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={userInfo.lastName}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-600">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={userInfo.password}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={userInfo.confirmPassword}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-6">My Appointments</h2>
            {appointments.length === 0 ? (
              <p className="text-gray-600">No appointments found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead className="bg-gray-200 text-gray-600">
                    <tr>
                      <th className="py-2 px-4 text-left">Client Name</th>
                      <th className="py-2 px-4 text-left">Service</th>
                      <th className="py-2 px-4 text-left">Date</th>
                      <th className="py-2 px-4 text-left">Status</th>
                      <th className="py-2 px-4 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment: any, index) => (
                      <tr
                        key={appointment.appointmentID}
                        className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                      >
                        <td className="py-2 px-4">{`${appointment.client?.firstName} ${appointment.client?.lastName}`}</td>
                        <td className="py-2 px-4">{appointment.serviceName || 'No Service'}</td>
                        <td className="py-2 px-4">{new Date(appointment.appointmentDate).toLocaleString()}</td>
                        <td className="py-2 px-4">{appointment.status}</td>
                        <td className="py-2 px-4">{appointment.notes || 'No Notes'}</td>
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
