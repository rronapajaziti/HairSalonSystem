import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { ApexOptions } from 'apexcharts';

const ChartThree: React.FC = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [chartData, setChartData] = useState({ labels: [], series: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const colors = [
    '#3C50E0',
    '#6577F3',
    '#8FD0EF',
    '#0FADCF',
    '#1A73E8',
    '#5B73E8',
    '#738AE0',
    '#4A90E2',
    '#002366',
    '#6A5ACD',
  ];

  const calculateDateRange = () => {
    const now = new Date();
    let startDate, endDate;

    if (timeRange === 'daily') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    } else if (timeRange === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear() + 1, 0, 1);
    }

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  };

  const fetchChartData = async () => {
    setLoading(true);
    setError(null);

    const { startDate, endDate } = calculateDateRange();

    try {
      const response = await axios.get(
        `https://api.studio-linda.com/api/Appointment/services-completed`,
        { params: { startDate, endDate } },
      );

      if (response?.data && Array.isArray(response.data)) {
        const labels = response.data.map((item: any) => item.serviceName);
        const series = response.data.map((item: any) => item.count);
        setChartData({ labels, series });
      } else {
        setError('Unexpected API response format.');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Failed to fetch data: ${err.response?.data || err.message}`);
      } else {
        setError('Failed to load data.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [timeRange]);

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      background: 'transparent',
    },
    colors: colors.slice(0, chartData.labels.length),
    labels: chartData.labels,
    legend: {
      position: 'bottom',
      labels: {
        colors: colorMode === 'dark' ? '#FFFFFF' : '#374151',
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%', // Increased donut size for better visuals
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

  const isChartDataValid =
    Array.isArray(chartData.series) &&
    chartData.series.length > 0 &&
    Array.isArray(chartData.labels) &&
    chartData.labels.length > 0;

  return (
    <div
      className="p-6 rounded-lg max-w-2xl mx-auto border border-gray-300 dark:border-gray-700"
      style={{
        backgroundColor: colorMode === 'dark' ? '#1A202C' : '#FFFFFF',
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h5
          className="text-lg font-semibold"
          style={{
            color: colorMode === 'dark' ? '#FFFFFF' : '#374151',
          }}
        >
          Shërbimet më të Shpesha
        </h5>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-1.5 border rounded-md text-sm"
          style={{
            backgroundColor: colorMode === 'dark' ? '#2D3748' : '#FFFFFF',
            color: colorMode === 'dark' ? '#FFFFFF' : '#374151',
            borderColor: colorMode === 'dark' ? '#4A5568' : '#D1D5DB',
          }}
        >
          <option value="daily">Ditore</option>
          <option value="monthly">Mujore</option>
          <option value="yearly">Vjetore</option>
        </select>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && isChartDataValid ? (
        <ReactApexChart
          options={options}
          series={chartData.series}
          type="donut"
          height={400} // Increased chart height for better visibility
        />
      ) : (
        <p>No valid data available to display.</p>
      )}
    </div>
  );
};

export default ChartThree;
