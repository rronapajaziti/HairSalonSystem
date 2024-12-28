import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceStaff = () => {
  const [serviceStaffList, setServiceStaffList] = useState<any[]>([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState<any[]>([]);
  const [dailyEarnings, setDailyEarnings] = useState<any[]>([]);

  useEffect(() => {
    fetchServiceStaff();
    fetchMonthlyEarnings();
    fetchDailyEarnings();

    const handleDataUpdate = () => {
      console.log('Data update detected, refreshing ServiceStaff data...');
      fetchServiceStaff();
      fetchDailyEarnings();
      fetchMonthlyEarnings();
    };

    window.addEventListener('dataUpdated', handleDataUpdate);

    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, []);

  const fetchServiceStaff = async () => {
    try {
      const response = await axios.get(
        'https://localhost:7158/api/ServiceStaff',
      );
      console.log('Fetched ServiceStaff:', response.data); // Debugging log
      setServiceStaffList(response.data);
    } catch (error) {
      console.error('Error fetching service staff data:', error);
    }
  };

  const fetchMonthlyEarnings = async () => {
    try {
      const response = await axios.get(
        'https://localhost:7158/api/ServiceStaff/monthly-earnings',
      );
      setMonthlyEarnings(response.data);
    } catch (error) {
      console.error('Error fetching monthly earnings:', error);
    }
  };

  const fetchDailyEarnings = async () => {
    try {
      const response = await axios.get(
        'https://localhost:7158/api/ServiceStaff/daily-earnings',
      );
      setDailyEarnings(response.data);
    } catch (error) {
      console.error('Error fetching daily earnings:', error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke text-black bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1 dark:text-white dark:border-strokedark dark:bg-boxdark">
      <h1 className="text-xl font-semibold text-blue-900 dark:text-white">
        Pagesa sipas Shërbimit
      </h1>

      {/* Service Staff Table */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-black dark:text-white">
                Emri i Punëtores
              </th>
              <th className="py-2 px-4 text-black dark:text-white">Shërbimi</th>
              <th className="py-2 px-4 text-black dark:text-white">
                Çmimi i Shërbimit
              </th>
              <th className="py-2 px-4 text-black dark:text-white">
                Përqindja
              </th>
              <th className="py-2 px-4 text-black dark:text-white">
                Pagesa për shërbim
              </th>
              <th className="py-2 px-4 text-black dark:text-white">
                Data e përfundimit
              </th>
            </tr>
          </thead>
          <tbody>
            {serviceStaffList.map((item) => (
              <tr key={item.serviceStaffID}>
                <td className="py-2 px-4 text-black dark:text-white">
                  {item.staffName}
                </td>
                <td className="py-2 px-4 text-black dark:text-white">
                  {item.serviceName}
                </td>
                <td className="py-2 px-4 text-black dark:text-white">
                  {item.servicePrice.toFixed(2)}€
                </td>
                <td className="py-2 px-4 text-black dark:text-white">
                  {item.percentage.toFixed(2)}%
                </td>
                <td className="py-2 px-4 text-black dark:text-white">
                  {item.staffEarning.toFixed(2)}€
                </td>
                <td className="py-2 px-4 text-black dark:text-white">
                  {item.dateCompleted
                    ? new Date(item.dateCompleted).toLocaleString()
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Daily Earnings Table */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-white">
          Pagesat Ditore
        </h2>
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 text-black dark:text-white">
                  Emri i Punëtores
                </th>
                <th className="py-2 px-4 text-black dark:text-white">Dita</th>
                <th className="py-2 px-4 text-black dark:text-white">Muaji</th>
                <th className="py-2 px-4 text-black dark:text-white">Viti</th>
                <th className="py-2 px-4 text-black dark:text-white">Totali</th>
              </tr>
            </thead>
            <tbody>
              {dailyEarnings.map((item) => (
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
