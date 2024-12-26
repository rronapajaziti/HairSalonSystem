import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdOutlineDelete } from 'react-icons/md';

const ServiceStaff = () => {
  const [serviceStaffList, setServiceStaffList] = useState<any[]>([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newServiceStaff, setNewServiceStaff] = useState({
    serviceID: '',
    staffID: '',
    dateCompleted: '',
  });
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServiceStaff();
    fetchUsers();
    fetchServices();
    fetchMonthlyEarnings();
  }, []);

  const fetchServiceStaff = async () => {
    try {
      const response = await axios.get(
        'https://localhost:7158/api/ServiceStaff',
      );
      const data = response.data.map((item) => ({
        ...item,
        servicePrice: item.servicePrice || 0,
        percentage: item.percentage || 0,
        staffEarning: item.staffEarning || 0,
      }));
      setServiceStaffList(data);
    } catch (error) {
      console.error('Error fetching service staff data:', error);
    }
  };

  const fetchMonthlyEarnings = async () => {
    try {
      const response = await axios.get(
        'https://localhost:7158/api/ServiceStaff/monthly-earnings',
      );
      const data = response.data.map((item) => ({
        ...item,
        TotalEarnings: item.TotalEarnings || 0,
      }));
      setMonthlyEarnings(data);
    } catch (error) {
      console.error('Error fetching monthly earnings:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        'https://localhost:7158/api/ServiceStaff/Users',
      );
      const allUsers = response.data;
      const staffAndOwners = allUsers.filter(
        (user: any) => user.roleID === 2 || user.roleID === 3,
      );
      setUsers(staffAndOwners);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('https://localhost:7158/api/Service');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewServiceStaff((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('https://localhost:7158/api/ServiceStaff', {
        serviceID: newServiceStaff.serviceID,
        staffID: newServiceStaff.staffID,
        dateCompleted: newServiceStaff.dateCompleted,
      });
      fetchServiceStaff(); // Refresh data
      resetForm();
    } catch (error) {
      console.error('Error creating service staff:', error);
    }
  };

  const handleDelete = async (serviceStaffID: number) => {
    try {
      await axios.delete(
        `https://localhost:7158/api/ServiceStaff/${serviceStaffID}`,
      );
      setServiceStaffList((prev) =>
        prev.filter((item) => item.serviceStaffID !== serviceStaffID),
      );
    } catch (error) {
      console.error('Error deleting service staff:', error);
    }
  };

  const resetForm = () => {
    setNewServiceStaff({
      serviceID: '',
      staffID: '',
      dateCompleted: '',
    });
    setShowForm(false);
  };

  return (
    <div className="rounded-sm border border-stroke text-black bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1 dark:text-white dark:border-strokedark dark:bg-boxdark">
      <h1 className="text-xl font-semibold text-blue-900 dark:text-white">
        Pagesa sipas Shërbimit
      </h1>
      <div className="overflow-x-auto mt-6">
        <table className="w-full text-left border-collapse">
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
                Fshij
              </th>
            </tr>
          </thead>
          <tbody>
            {serviceStaffList.map((item) => (
              <tr key={item.serviceStaffID}>
                <td className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                  {item.staffName || 'Unknown Staff'}
                </td>
                <td className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                  {item.serviceName || 'Unknown Service'}
                </td>
                <td className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                  {item.servicePrice.toFixed(2)}€
                </td>
                <td className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                  {item.percentage.toFixed(2)}%
                </td>
                <td className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                  {item.staffEarning.toFixed(2)}€
                </td>
                <td className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                  {item.dateCompleted || 'N/A'}
                </td>
                <td className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                  <button
                    onClick={() => handleDelete(item.serviceStaffID)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    <MdOutlineDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
          Pagesat Mujore
        </h2>
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                  Emri i Punëtores
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
              {monthlyEarnings.map((item) => (
                <tr key={`${item.staffID}-${item.year}-${item.month}`}>
                  <td className="py-2 px-4  text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                    {item.staffName || 'Unknown Staff'}
                  </td>
                  <td className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                    {new Date(item.year, item.month - 1).toLocaleString('sq', {
                      month: 'long',
                    })}
                  </td>
                  <td className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                    {item.year}
                  </td>
                  <td className="py-2 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                    {item.totalEarnings
                      ? item.totalEarnings.toFixed(2)
                      : '0.00'}
                    €
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
