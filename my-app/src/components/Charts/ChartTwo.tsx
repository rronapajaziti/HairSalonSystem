import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { startOfWeek, endOfWeek } from 'date-fns';

const ChartTwo: React.FC = () => {
  const [currentWeekProfit, setCurrentWeekProfit] = useState<number>(0);
  const [colorMode, setColorMode] = useState<string>(
    localStorage.getItem('colorMode') || 'light',
  );

  // Watch for changes in dark mode
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

      const response = await axios.get(
        `https://api.studio-linda.com/api/Appointment/total-revenue?startDate=${startOfCurrentWeek.toISOString()}&endDate=${endOfCurrentWeek.toISOString()}`,
      );

      setCurrentWeekProfit(response.data.totalRevenue || 0);
    } catch (error) {
      console.error('Error fetching weekly profit data:', error);
    }
  };

  useEffect(() => {
    fetchWeeklyData();
  }, []);

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
      categories: ['Current Week'],
      labels: {
        style: {
          colors: colorMode === 'dark' ? '#FFFFFF' : '#374151',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Profit (€)',
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

  const series = [{ name: 'Profit', data: [currentWeekProfit] }];

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
        Weekly Profit
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
