import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { startOfWeek, endOfWeek, format } from 'date-fns';

const ChartTwo: React.FC = () => {
  const [appointmentsPerDay, setAppointmentsPerDay] = useState<number[]>([]);
  const [colorMode, setColorMode] = useState<string>(
    localStorage.getItem('colorMode') || 'light',
  );

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

  const fetchWeeklyData = async () => {
    try {
      const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
      const endOfCurrentWeek = endOfWeek(new Date(), { weekStartsOn: 1 });

      const formattedStartDate = format(startOfCurrentWeek, 'yyyy-MM-dd');
      const formattedEndDate = format(endOfCurrentWeek, 'yyyy-MM-dd');

      const response = await axios.get(
        'https://api.studio-linda.com/api/Appointment/appointments-completed-by-day',
        {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          },
        },
      );

      const dailyAppointments = response.data.map(
        (entry: { completedAppointments: number }) =>
          entry.completedAppointments,
      );

      setAppointmentsPerDay(dailyAppointments);
    } catch (error) {
      console.error('Error fetching weekly data:', error);
      setAppointmentsPerDay([0, 0, 0, 0, 0, 0, 0]);
    }
  };

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

  const options = {
    chart: {
      type: 'bar',
      height: 250,
      toolbar: { show: false },
      background: 'transparent',
    },
    xaxis: {
      categories: daysOfWeek,
      labels: {
        style: {
          colors: colorMode === 'dark' ? '#FFFFFF' : '#374151',
        },
        offsetX: 0, // Aligns the labels properly
      },
    },
    plotOptions: {
      bar: { columnWidth: '70%', borderRadius: 4 }, // Adjusted column width
    },
    grid: {
      padding: {
        left: 0,
        right: 0,
      },
    },

    yaxis: {
      title: {
        text: 'Terminet',
        style: {
          color: colorMode === 'dark' ? '#FFFFFF' : '#374151',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      },
      labels: {
        style: {
          colors: colorMode === 'dark' ? '#FFFFFF' : '#374151',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      },
    },
    dataLabels: { enabled: false },
    colors: ['#2563EB'],
    tooltip: {
      theme: colorMode, // Switch between 'light' and 'dark' automatically
      style: {
        fontSize: '13px',
        fontFamily: 'Arial, sans-serif',
      },
      marker: {
        show: true,
      },
      y: {
        formatter: (value: number) => `${value} Terminet`, // Customize tooltip values
      },
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const value = series[seriesIndex][dataPointIndex];
        const day = w.globals.labels[dataPointIndex];
        return `
          <div style="
            background: ${colorMode === 'dark' ? '#1F2937' : '#FFFFFF'};
            color: ${colorMode === 'dark' ? '#E5E7EB' : '#333333'};
            border: 1px solid ${colorMode === 'dark' ? '#374151' : '#E5E7EB'};
            padding: 10px;
            border-radius: 8px;
            box-shadow: ${
              colorMode === 'dark'
                ? '0 2px 4px rgba(0, 0, 0, 0.5)'
                : '0 2px 4px rgba(0, 0, 0, 0.1)'
            };
          ">
            <strong>${day}</strong>
            <div>${value} Terminet</div>
          </div>`;
      },
    },
  };

  const series = [{ name: 'Terminet', data: appointmentsPerDay }];

  return (
    <div
      className="p-6 rounded-lg max-w-lg mx-auto border shadow-md dark:border-gray-700"
      style={{
        backgroundColor: colorMode === 'dark' ? '#1F2937' : '#FFFFFF',
      }}
    >
      <h2
        className="text-xl font-semibold text-center mb-4"
        style={{
          color: colorMode === 'dark' ? '#E5E7EB' : '#374151',
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
