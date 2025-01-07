import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientTable = ({ searchQuery }: { searchQuery: string }) => {
  const [clientList, setClientList] = useState<any[]>([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get(
        'https://innovocode-hairsalon.com/api/Client',
      );
      const filteredClients = response.data.map((client: any) => ({
        ...client,
        id: client.clientID,
      }));
      setClientList(filteredClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  // Filter clients based on search query
  const filteredClients = clientList.filter((client) =>
    `${client.firstName} ${client.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h1 className="text-xl font-semibold dark:text-white text-blue-900 mb-4">
        Klientët
      </h1>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto dark:border-strokedark dark:bg-boxdark">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Emri dhe Mbiemri
              </th>
              <th className="py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Numri i Telefonit
              </th>
              <th className="py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id}>
                <td className="py-4 px-4 dark:text-white text-black">
                  {client.firstName} {client.lastName}
                </td>
                <td className="py-4 px-4 dark:text-white text-black">
                  {client.phoneNumber}
                </td>
                <td className="py-4 px-4 dark:text-white text-black">
                  {client.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientTable;
