import React, { useState } from 'react';

const Calendar = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState([
    {
      date: '2024-12-01',
      title: 'Meeting',
      time: '12:00~14:00',
      color: 'bg-blue-500',
      staff: 'John',
    },
    {
      date: '2024-12-01',
      title: 'Dinner',
      time: '18:00~20:00',
      color: 'bg-blue-400',
      staff: 'Doe',
    },

    {
      date: '2024-12-07',
      title: 'Shopping',
      time: '12:00~14:00',
      color: 'bg-blue-600',
      staff: 'Jane',
    },
  ]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getCalendarData = () => {
    const firstDay = new Date(year, month - 1).getDay();
    const daysInMonth = getDaysInMonth(month, year);
    const days = [];

    // Fill the calendar with empty days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Fill the calendar with days of the month
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

  const rows = [];
  for (let i = 0; i < 5; i++) {
    const start = i * 6;
    const end = start + 6;
    const week = calendarData.slice(start, end);
    if (week.some((day) => day !== null)) {
      rows.push(week);
    }
  }

  return (
    <div className="container mx-auto mt-10">
      <div className="wrapper bg-white rounded shadow w-full  dark:border-strokedark dark:bg-boxdark dark:text-white">
        <div className="header flex justify-between border-b p-2">
          <span className="text-lg font-bold text-blue-900 dark:text-white">
            {year} {month < 10 ? `0${month}` : month}
          </span>
          <div className="buttons flex gap-4">
            <button className="p-1" onClick={handlePrevMonth}>
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m15 19-7-7 7-7"
                />
              </svg>
            </button>
            <button className="p-1" onClick={handleNextMonth}>
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m9 5 7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
        <table className="w-full  dark:border-strokedark dark:bg-boxdark dark:text-white">
          <thead>
            <tr>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
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
                      className="border p-1 h-40 w-40 overflow-hidden"
                    >
                      <div className="flex flex-col h-40 mx-auto overflow-hidden">
                        <div className="top h-5 w-full">
                          <span className="text-gray-500">{day}</span>
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
