import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientTable = ({ searchQuery }: { searchQuery: string }) => {
  const [clientList, setClientList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true); // Start loading when fetching data

    try {
      // Step 1: Fetch all appointments to get client data
      const response = await axios.get(
        'https://api.studio-linda.com/api/Appointment',
      );

      const appointments = response.data;

      // Step 2: Fetch completed appointments for each client and merge with client data
      const updatedClients = await Promise.all(
        appointments.map(async (appointment: any) => {
          const { firstName, lastName, phoneNumber, email } =
            appointment.client;

          try {
            // Step 3: Fetch completed appointments for each client
            const countResponse = await axios.get(
              `https://api.studio-linda.com/api/appointment/completed-appointments-client?firstName=${firstName}&lastName=${lastName}&phoneNumber=${phoneNumber}&email=${email}`,
            );

            const completedAppointments =
              countResponse.data?.completedAppointments || 0;
            return {
              ...appointment.client,
              completedAppointments,
            };
          } catch (error) {
            console.error(
              `Error fetching completed appointments for ${firstName} ${lastName}:`,
              error,
            );
            return {
              ...appointment.client,
              completedAppointments: 0, // Default to 0 if error occurs
            };
          }
        }),
      );

      setClientList(updatedClients); // Update state with the merged client data
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false); // Stop loading after the request is complete
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
        {loading ? (
          <div>Loading...</div> // Show loading text while data is being fetched
        ) : (
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
                <th className="py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                  Terminet e Kryera
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr key={client.email}>
                    {' '}
                    {/* Use email or another unique identifier */}
                    <td className="py-4 px-4 dark:text-white text-black">
                      {client.firstName} {client.lastName}
                    </td>
                    <td className="py-4 px-4 dark:text-white text-black">
                      {client.phoneNumber}
                    </td>
                    <td className="py-4 px-4 dark:text-white text-black">
                      {client.email}
                    </td>
                    <td className="py-4 px-4 dark:text-white text-black text-center">
                      {client.completedAppointments}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 px-4 text-center">
                    No clients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClientTable;
