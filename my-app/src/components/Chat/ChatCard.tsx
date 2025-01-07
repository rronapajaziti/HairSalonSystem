import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Customer {
  name: string;
  completedAppointments: number;
}

const BestCustomersCard = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const colors = [
    '#3C50E0',
    '#6577F3',
    '#8FD0EF',
    '#0FADCF',
    '#6A5ACD',
    '#7B68EE',
    '#8A2BE2',
    '#9370DB',
    '#483D8B',
    '#4169E1',
  ];

  const fetchBestCustomers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        'https://localhost:7158/api/Appointment/top-customers',
      );

      if (response?.data && Array.isArray(response.data)) {
        setCustomers(response.data);
      } else {
        setError('Formati i përgjigjes API është i papritur.');
      }
    } catch (err) {
      setError('Dështoi ngarkimi i klientëve më të mirë.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestCustomers();
  }, []);

  if (loading) {
    return <p>Po ngarkohet...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="col-span-12 rounded-sm border border-stroke m-7 p-5 bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        10 Klientët më të rregullt
      </h4>

      <div>
        {customers.map((customer, key) => (
          <div
            className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4"
            key={key}
          >
            <div
              className="relative h-14 w-14 flex items-center justify-center font-bold text-white"
              style={{
                backgroundColor: colors[key % colors.length],
                borderRadius: '5px',
              }}
            >
              {customer.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  {customer.name}
                </h5>
                <p className="text-sm text-black dark:text-white">
                  {customer.completedAppointments} Takime të Përfunduara
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestCustomersCard;
