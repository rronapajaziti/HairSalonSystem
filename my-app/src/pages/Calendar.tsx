import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Calendar = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState<any[]>([]);
  const [staffColors, setStaffColors] = useState<any>({});

  const blueShades = [
    'bg-blue-500',
    'bg-blue-600',
    'bg-blue-400',
    'bg-blue-700',
    'bg-blue-800',
    'bg-blue-900',
  ];

  useEffect(() => {
    fetchAppointments();
  }, [month, year]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        'https://localhost:7158/api/Appointment',
      );
      const appointments = response.data;

      const newStaffColors: any = {};
      let colorIndex = 0;

      const formattedEvents = appointments.map((appointment: any) => {
        const staffName = appointment.staffName || 'No Staff';

        // Assign a unique color for each staff
        if (!newStaffColors[staffName]) {
          newStaffColors[staffName] =
            blueShades[colorIndex % blueShades.length];
          colorIndex++;
        }

        return {
          date: appointment.appointmentDate.split('T')[0],
          title: appointment.serviceName || 'No Service',
          time: 'All Day',
          color: newStaffColors[staffName],
          staff: staffName,
        };
      });

      setEvents(formattedEvents);
      setStaffColors(newStaffColors);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getCalendarData = () => {
    const firstDay = new Date(year, month - 1).getDay();
    const daysInMonth = getDaysInMonth(month, year);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const calendarData = getCalendarData();

  const renderEvents = (date: number) => {
    const eventKey = `${year}-${month < 10 ? `0${month}` : month}-${date < 10 ? `0${date}` : date}`;
    return events
      .filter((event) => event.date === eventKey)
      .map((event, index) => (
        <div
          key={index}
          className={`text-white p-2 mb-1 text-sm rounded w-full ${event.color} overflow-auto`}
        >
          {event.title} ({event.staff})
        </div>
      ));
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold text-left text-blue-900 mt-4 mb-6 dark:text-white">
        Kalendari
      </h1>
      <div className="wrapper bg-white rounded shadow w-full dark:border-strokedark dark:bg-boxdark dark:text-white">
        <div className="header flex justify-between border-b p-2">
          <span className="text-lg font-bold text-blue-900 dark:text-white">
            {year} {month < 10 ? `0${month}` : month}
          </span>
          <div className="buttons flex gap-4">
            <button className="p-1" onClick={handlePrevMonth}>
              <svg
                className="w-6 h-6 text-white dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m15 19-7-7 7-7"
                />
              </svg>
            </button>
            <button className="p-1" onClick={handleNextMonth}>
              <svg
                className="w-6 h-6 text-white dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m9 5 7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
        <table className="w-full dark:border-strokedark dark:bg-boxdark dark:text-white">
          <thead>
            <tr>
              {[
                'E Diel',
                'E Hënë',
                'E Martë',
                'E Mërkurë',
                'E Enjëte',
                'E Premte',
                'E  Shtunë',
              ].map((day) => (
                <th
                  key={day}
                  className="p-2 border-r h-10 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark"
                >
                  <span>{day}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, rowIndex) => (
              <tr key={rowIndex} className="text-center h-20">
                {Array.from({ length: 7 }, (_, colIndex) => {
                  const dayIndex = rowIndex * 7 + colIndex;
                  const day = calendarData[dayIndex] || '';
                  return (
                    <td
                      key={colIndex}
                      className="border border-gray-300 p-1 h-40 w-40 overflow-hidden dark:text-white"
                    >
                      <div className="flex flex-col h-40 mx-auto overflow-hidden">
                        <div className="top h-5 w-full">
                          <span className="text-gray-900 dark:text-white">
                            {day}
                          </span>
                        </div>
                        <div className="bottom flex-grow h-30 py-1 w-full overflow-y-auto">
                          {day && renderEvents(day)}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calendar;
