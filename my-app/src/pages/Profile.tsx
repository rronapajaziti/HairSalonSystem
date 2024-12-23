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
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if the user is logged in; if not, redirect to login page
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    // const isLoggedIn = localStorage.getItem("token");
    // if (isLoggedIn) {
    //   navigate("/profile"); 
    // }

    // if (!token || !userId) {
    //   navigate('/signin'); 
    // }

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

 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        throw new Error('User is not logged in.');
      }

      await axios.put(
        `https://localhost:7158/api/User/${userId}`,
        {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email,
          phone: userInfo.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating user data:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  // Log out
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    navigate('/signin');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray text-black p-8 rounded-l-xl shadow-lg dark:text-white">
        <div className="text-center mb-8 dark:text-white">
          <img
            src={userProfilePic}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white"
          />
          <h2 className="text-2xl font-semibold dark:text-white">
            {userInfo.firstName} {userInfo.lastName}
          </h2>
          <p className="">Web Developer</p>
        </div>
        <nav className="flex flex-col space-y-6 text-lg">
          <a href="#" className="hover:text-blue-500 transition duration-300">
            Profile
          </a>
          <a href="#" className="hover:text-blue-500 transition duration-300">
            Appointments
          </a>
          <a href="/settings" className="hover:text-blue-500 transition duration-300">
            Settings
          </a>
          <button
            onClick={handleLogout}
            className="hover:text-blue-500 transition duration-300"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-10 space-y-6 bg-white rounded-r-xl shadow-xl dark:border-strokedark dark:bg-boxdark dark:text-white">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">
          Edit Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="firstName" className="text-sm font-medium text-gray-600 dark:text-white">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={userInfo.firstName}
              onChange={handleChange}
              className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-strokedark dark:bg-boxdark dark:text-white"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="lastName" className="text-sm font-medium text-gray-600 dark:text-white">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={userInfo.lastName}
              onChange={handleChange}
              className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium text-gray-600 dark:text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userInfo.email}
              onChange={handleChange}
              className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-sm font-medium text-gray-600 dark:text-white">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={userInfo.phone}
              onChange={handleChange}
              className="mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white focus:ring-2 focus:ring-indigo-500"
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
      </div>
    </div>
  );
};

export default Profile;
