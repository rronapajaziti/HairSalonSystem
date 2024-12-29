import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DailyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [services, setServices] = useState([]);
  const [timeSlots, setTimeSlots] = useState([
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
  ]);

  useEffect(() => {
    fetchAppointments();
    fetchServices();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7158/api/Appointment/schedule?date=${selectedDate}`,
      );
      const fetchedAppointments = response.data.appointments || [];
      setAppointments(fetchedAppointments);

      // Update timeSlots with missing times
      const newTimes = fetchedAppointments.map((appt) =>
        new Date(appt.appointmentDate)
          .toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
          .slice(0, 5),
      );

      setTimeSlots((prevTimeSlots) => {
        const allTimes = [...prevTimeSlots, ...newTimes];
        const uniqueTimes = Array.from(new Set(allTimes)); // Remove duplicates
        return uniqueTimes.sort(); // Ensure times are sorted
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('https://localhost:7158/api/Service');
      setServices(response.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
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

  const calculateRemainingRevenue = (service) => {
    const serviceAppointments = appointments.filter(
      (appt) =>
        appt.serviceName === service.serviceName &&
        appt.status.toLowerCase() === 'përfunduar',
    );

    return serviceAppointments.reduce((total, appt) => {
      const percentage = parseFloat(service.staffEarningPercentage) || 0;
      const price = parseFloat(appt.price) || 0;
      const priceAfterStaffCut = price * (1 - percentage / 100);
      return total + priceAfterStaffCut;
    }, 0);
  };

  const calculateTotalForDay = () => {
    return services.reduce((total, service) => {
      return total + calculateRemainingRevenue(service);
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
                  {calculateRemainingRevenue(service).toFixed(2)}€
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
                Fitimi i Ditës: {calculateTotalForDay().toFixed(2)}€
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default DailyAppointments;
