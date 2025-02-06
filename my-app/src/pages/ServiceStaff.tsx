import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdOutlineDelete } from 'react-icons/md';
import { jwtDecode } from 'jwt-decode';

const ServiceStaff = () => {
  const [serviceStaffList, setServiceStaffList] = useState<any[]>([]);
  const [dailyEarnings, setDailyEarnings] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [filterDate, setFilterDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );

  useEffect(() => {
    fetchServiceStaff();
    fetchDailyEarnings();
    fetchDiscounts();

    const handleDataUpdate = () => {
      fetchServiceStaff();
      fetchDailyEarnings();
      fetchDiscounts();
    };

    window.addEventListener('dataUpdated', handleDataUpdate);

    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, [filterDate]);

  const fetchServiceStaff = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No token found');

      const decodedToken: any = jwtDecode(token);

      const roleID = decodedToken.RolesID || decodedToken.roleID; // Adjust claim name as needed
      const userID = localStorage.getItem('userId'); // Ensure consistency

      if (!userID) {
        console.error('UserID not found in localStorage!');
        return;
      }

      const response = await axios.get(
        'https://api.studio-linda.com/api/ServiceStaff',
        {
          params: { roleID, userID }, // Pass roleID and userID to the backend
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Update the state with all data
      setServiceStaffList(response.data);
    } catch (error) {
      console.error('Error fetching service staff data:', error);
    }
  };

  const fetchDailyEarnings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No token found');

      const decodedToken: any = jwtDecode(token);

      const roleID = decodedToken.RolesID || decodedToken.roleID; // Adjust claim name as needed
      const userID = localStorage.getItem('userId'); // Ensure consistency

      const response = await axios.get(
        'https://api.studio-linda.com/api/ServiceStaff/daily-earnings',
        {
          params: { roleID, userID }, // Pass roleID and userID to the backend
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (roleID == 3 || roleID == '3') {
        setDailyEarnings(
          response.data.filter((item: any) => String(item.userID) === userID),
        );
      } else {
        setDailyEarnings(response.data);
      }
    } catch (error) {
      console.error('Error fetching daily earnings:', error);
    }
  };

  const fetchDiscounts = async () => {
    try {
      const response = await axios.get(
        'https://api.studio-linda.com/api/ServiceDiscount',
      );
      setDiscounts(response.data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  };

  const calculateDiscountedPrice = (
    servicePrice: number,
    serviceID: number,
  ) => {
    const now = new Date();
    const applicableDiscount = discounts.find(
      (discount) =>
        discount.serviceID === serviceID &&
        new Date(discount.startDate) <= now &&
        new Date(discount.endDate) >= now,
    );

    if (applicableDiscount) {
      return (
        servicePrice -
        (servicePrice * applicableDiscount.discountPercentage) / 100
      ).toFixed(2);
    }

    return servicePrice.toFixed(2);
  };

  const filteredServiceStaff = serviceStaffList.filter((item) => {
    if (!item.dateCompleted) return false; // Skip invalid dates
    const itemDate = new Date(item.dateCompleted).toISOString().split('T')[0];
    return itemDate === filterDate;
  });

  const filteredDailyEarnings = dailyEarnings.filter((item) => {
    const itemDate = new Date(Date.UTC(item.year, item.month - 1, item.day))
      .toISOString()
      .split('T')[0];
    return itemDate === filterDate;
  });

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://api.studio-linda.com/api/ServiceStaff/${id}`);
      await fetchServiceStaff(); // Refresh the data
    } catch (error) {
      console.error('Error deleting ServiceStaff record:', error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke text-black bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1 dark:text-white dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-center mb-4">
        <label className="mr-4 text-black dark:text-white">
          Filtro sipas datës:
        </label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-4 py-2 border rounded-md text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
        />
      </div>{' '}
      <h1 className="text-xl font-semibold text-blue-900 dark:text-white ">
        Pagesa sipas Shërbimit
      </h1>
      {/* Service Staff Table */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full text-left border-collapse text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Emri i Punëtores
              </th>
              <th className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Shërbimi
              </th>
              <th className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Çmimi i Shërbimit
              </th>
              <th className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Përqindja
              </th>
              <th className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Pagesa për shërbim
              </th>
              <th className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Data e përfundimit
              </th>
              <th className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Veprime
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredServiceStaff.map((item) => {
              const discountedPrice = parseFloat(
                calculateDiscountedPrice(item.servicePrice, item.serviceID),
              );
              const staffEarning = (discountedPrice * item.percentage) / 100;

              return (
                <tr key={item.serviceStaffID}>
                  <td className="py-2 px-4 text-black dark:text-white">
                    {item.staffName || 'N/A'}
                  </td>
                  <td className="py-2 px-4 text-black dark:text-white">
                    {item.serviceName || 'N/A'}
                  </td>
                  <td className="py-2 px-4 text-black dark:text-white">
                    {discountedPrice.toFixed(2)}€
                  </td>
                  <td className="py-2 px-4 text-black dark:text-white">
                    {item.percentage?.toFixed(2) || '0.00'}%
                  </td>
                  <td className="py-2 px-4 text-black dark:text-white">
                    {staffEarning.toFixed(2)}€
                  </td>
                  <td className="py-2 px-4 text-black dark:text-white">
                    {item.dateCompleted
                      ? new Date(item.dateCompleted).toLocaleString()
                      : 'N/A'}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(item.serviceStaffID)}
                      className="bg-red-500 text-white rounded-md px-4 py-2 text-base sm:px-4 sm:py-2 sm:text-sm"
                    >
                      <MdOutlineDelete />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Daily Earnings Table */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-white ">
          Pagesat Ditore
        </h2>
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-left border-collapse text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                  Emri i Punëtores
                </th>
                <th className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                  Dita
                </th>
                <th className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                  Muaji
                </th>
                <th className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                  Viti
                </th>
                <th className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                  Totali
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDailyEarnings.map((item) => (
                <tr
                  key={`${item.staffID}-${item.year}-${item.month}-${item.day}`}
                >
                  <td className="py-2 px-4 text-black dark:text-white">
                    {item.staffName}
                  </td>
                  <td className="py-2 px-4 text-black dark:text-white">
                    {item.day}
                  </td>
                  <td className="py-2 px-4 text-black dark:text-white">
                    {new Date(item.year, item.month - 1).toLocaleString('sq', {
                      month: 'long',
                    })}
                  </td>
                  <td className="py-2 px-4 text-black dark:text-white">
                    {item.year}
                  </td>
                  <td className="py-2 px-4 text-black dark:text-white">
                    {item.totalEarnings.toFixed(2)}€
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceStaff;
