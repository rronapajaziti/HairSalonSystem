import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DailyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [services, setServices] = useState([]);

  const timeSlots = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
  ];

  useEffect(() => {
    fetchAppointments();
    fetchServices();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7158/api/Appointment/schedule?date=${selectedDate}`,
      );
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Gabim gjatë marrjes së termineve:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('https://localhost:7158/api/Service');
      setServices(response.data || []);
    } catch (error) {
      console.error('Gabim gjatë marrjes së shërbimeve:', error);
    }
  };

  const getAppointmentsForTimeAndService = (timeSlot, serviceName) => {
    return appointments.filter((appt) => {
      const appointmentTime = new Date(appt.appointmentDate)
        .toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
        .slice(0, 5);
      return appointmentTime === timeSlot && appt.serviceName === serviceName;
    });
  };

  const calculateServiceRemaining = (serviceName) => {
    const service = services.find((s) => s.serviceName === serviceName);
    if (!service) return 0;

    const percentage = service.staffPercentage || 0;

    return appointments
      .filter(
        (appt) =>
          appt.serviceName === serviceName &&
          appt.status.toLowerCase() === 'përfunduar',
      )
      .reduce((total, appt) => {
        const priceAfterStaffCut = appt.price * (1 - percentage / 100);
        return total + priceAfterStaffCut;
      }, 0);
  };

  const calculateTotalForDay = () => {
    return services.reduce((total, service) => {
      return total + calculateServiceRemaining(service.serviceName);
    }, 0);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">
        Orari Ditor për {new Date(selectedDate).toLocaleDateString('sq-AL')}
      </h2>
      <div className="flex items-center mb-4">
        <label className="mr-2 font-medium text-gray-700">Zgjidh Datën:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-2 py-1 rounded shadow-sm"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 bg-gray-200 text-left">
                Ora
              </th>
              {services.map((service, index) => (
                <th
                  key={index}
                  className="border border-gray-300 px-4 py-2 bg-gray-200 text-left"
                >
                  {service.serviceName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((timeSlot, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">
                  {timeSlot}
                </td>
                {services.map((service, serviceIndex) => (
                  <td
                    key={serviceIndex}
                    className="border border-gray-300 px-4 py-2"
                  >
                    {getAppointmentsForTimeAndService(
                      timeSlot,
                      service.serviceName,
                    ).map((appt, apptIndex) => (
                      <div
                        key={apptIndex}
                        className={`text-sm p-1 rounded shadow-md mb-1 ${
                          appt.status === 'përfunduar'
                            ? 'bg-red-200'
                            : 'bg-blue-50'
                        }`}
                      >
                        <span className="font-medium">
                          {appt.clientName || 'Pa Klient'}
                        </span>{' '}
                        - <span>{appt.staffName || 'Pa Staf'}</span>
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">
                Totali për Shërbim
              </td>
              {services.map((service, index) => (
                <td
                  key={index}
                  className="border border-gray-300 px-4 py-2 font-medium text-green-600"
                >
                  {calculateServiceRemaining(service.serviceName).toFixed(2)}€
                </td>
              ))}
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={services.length + 1}
                className="border border-gray-300 px-4 py-2 font-bold text-right text-blue-700"
              >
                Totali i Ditës: {calculateTotalForDay().toFixed(2)}€
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default DailyAppointments;
