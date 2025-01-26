import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { ApexOptions } from 'apexcharts';

const ChartOne: React.FC = () => {
  const [series, setSeries] = useState([
    { name: 'Numri i Takimeve', data: [] },
  ]);
  const [categories, setCategories] = useState<string[]>([]);
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

  useEffect(() => {
    fetchWeeklyData();
  }, []);

  const fetchWeeklyData = async () => {
    try {
      const startDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
      );
      const endDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0,
      );

      const response = await axios.get(
        'https://api.studio-linda.com/api/Appointment/appointment-count-weekly',
        {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        },
      );

      const data = response.data;

      // Prepare data for the chart
      const weeks = data.map((entry: { week: number }) => `Java ${entry.week}`);
      const appointmentCounts = data.map(
        (entry: { appointmentCount: number }) => entry.appointmentCount,
      );

      setCategories(weeks);
      setSeries([{ name: 'Numri i Takimeve', data: appointmentCounts }]);
    } catch (error) {
      console.error('Error fetching weekly appointment data:', error);
    }
  };

  const options: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      background: 'transparent',
    },
    colors: ['#3C50E0'],
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: colorMode === 'dark' ? '#2D3748' : '#E5E7EB',
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    markers: {
      size: 4,
      colors: '#fff',
      strokeColors: ['#3056D3'],
      strokeWidth: 2,
    },
    xaxis: {
      type: 'category',
      categories,
      labels: {
        style: {
          colors: colorMode === 'dark' ? '#FFFFFF' : '#374151',
        },
      },
    },
    yaxis: {
      title: { text: '' },
      labels: {
        style: {
          colors: colorMode === 'dark' ? '#FFFFFF' : '#374151',
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: colorMode === 'dark' ? '#FFFFFF' : '#374151',
      },
    },
  };

  return (
    <div
      className="p-6 rounded-lg max-w-lg mx-auto border border-gray-300 dark:border-gray-700"
      style={{
        backgroundColor: colorMode === 'dark' ? 'transparent' : '#FFFFFF',
        maxWidth: '900px',
      }}
    >
      <h2
        className="text-xl font-semibold text-center mb-4"
        style={{
          color: colorMode === 'dark' ? '#FFFFFF' : '#374151',
        }}
      >
        Terminet Mujore
      </h2>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={250}
      />
    </div>
  );
};

export default ChartOne;
