import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const ChartThree: React.FC = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [chartData, setChartData] = useState({ labels: [], series: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    '#9370DB',
    '#8A2BE2',
    '#9400D3',
    '#7B68EE',
    '#6A5ACD',
    '#483D8B',
    '#4169E1',
    '#7C83FD',
    '#6B8E23',
    '#5F9EA0',
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
        `https://innovocode-hairsalon.com/api/Appointment/services-completed`,
        { params: { startDate, endDate } },
      );

      console.log('Response Data:', response.data);

      if (response?.data && Array.isArray(response.data)) {
        const labels = response.data.map((item: any) => item.serviceName);
        const series = response.data.map((item: any) => item.count);
        setChartData({ labels, series });
      } else {
        console.error('Unexpected API response format:', response);
        setError('Unexpected API response format.');
      }
    } catch (err) {
      console.error('Error fetching data:', err);

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

  useEffect(() => {
    console.log('Chart Data:', chartData);
  }, [chartData]);

  const options: ApexOptions = {
    chart: {
      type: 'donut',
    },
    colors: colors.slice(0, chartData.labels.length),
    labels: chartData.labels,
    legend: { show: true },
    plotOptions: {
      pie: { donut: { size: '65%' } },
    },
    dataLabels: { enabled: false },
  };

  const isChartDataValid =
    Array.isArray(chartData.series) &&
    chartData.series.length > 0 &&
    Array.isArray(chartData.labels) &&
    chartData.labels.length > 0;

  return (
    <div>
      <div>
        <h5 className="text-blue-900 dark:text-white">
          Shërbimet më të Shpesha
        </h5>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
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
        />
      ) : (
        <p>No valid data available to display.</p>
      )}
    </div>
  );
};

export default ChartThree;
