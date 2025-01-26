import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { startOfWeek, endOfWeek, format } from 'date-fns';

const ChartTwo: React.FC = () => {
  const [appointmentsPerDay, setAppointmentsPerDay] = useState<number[]>([]); // Holds the number of appointments for each day
  const [colorMode, setColorMode] = useState<string>(
    localStorage.getItem('colorMode') || 'light',
  );

  // Toggle between dark and light mode
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.body.classList.contains('dark');
      setColorMode(isDark ? 'dark' : 'light');
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  // Fetch weekly data
  const fetchWeeklyData = async () => {
    try {
      const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
      const endOfCurrentWeek = endOfWeek(new Date(), { weekStartsOn: 1 });

      console.log('Start of Current Week:', startOfCurrentWeek);
      console.log('End of Current Week:', endOfCurrentWeek);

      const formattedStartDate = format(startOfCurrentWeek, 'yyyy-MM-dd');
      const formattedEndDate = format(endOfCurrentWeek, 'yyyy-MM-dd');

      // Fetching the completed appointments data from the API
      const response = await axios.get(
        'https://api.studio-linda.com/api/Appointment/appointments-completed-by-day',
        {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          },
        },
      );

      console.log('API Response:', response.data);

      // Map the response data to appointments count for each day
      const dailyAppointments = response.data.map(
        (entry: { completedAppointments: number }) =>
          entry.completedAppointments,
      );

      console.log('Mapped Appointments:', dailyAppointments); // Log the mapped data

      // Update the state with the data
      setAppointmentsPerDay(dailyAppointments);
    } catch (error) {
      console.error('Error fetching weekly data:', error);
      setAppointmentsPerDay([0, 0, 0, 0, 0, 0, 0]); // Default to 0 if error occurs
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchWeeklyData();
  }, []);

  const daysOfWeek = [
    'E Hënë',
    'E Martë',
    'E Mërkurë',
    'E Enjte',
    'E Premte',
    'E Shtunë',
    'E Diel',
  ];

  // Chart options
  const options = {
    chart: {
      type: 'bar',
      height: 250,
      toolbar: { show: false },
      background: 'transparent',
    },
    plotOptions: {
      bar: { columnWidth: '50%', borderRadius: 4 },
    },
    xaxis: {
      categories: daysOfWeek,
      labels: {
        style: {
          colors: colorMode === 'dark' ? '#FFFFFF' : '#374151',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Terminet',
        style: {
          color: colorMode === 'dark' ? '#FFFFFF' : '#374151',
        },
      },
      labels: {
        style: {
          colors: colorMode === 'dark' ? '#FFFFFF' : '#374151',
        },
      },
    },
    grid: {
      borderColor: colorMode === 'dark' ? '#2D3748' : '#E5E7EB',
    },
    dataLabels: { enabled: false },
    colors: ['#2563EB'],
  };

  // Data for the chart
  const series = [{ name: 'Terminet', data: appointmentsPerDay }];

  return (
    <div
      className="p-6 rounded-lg max-w-lg mx-auto border border-gray-300 dark:border-gray-700"
      style={{
        backgroundColor: colorMode === 'dark' ? 'transparent' : '#FFFFFF',
      }}
    >
      <h2
        className="text-xl font-semibold text-center mb-4"
        style={{
          color: colorMode === 'dark' ? '#FFFFFF' : '#374151',
        }}
      >
        Terminet Javore
      </h2>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={250}
      />
    </div>
  );
};

export default ChartTwo;
