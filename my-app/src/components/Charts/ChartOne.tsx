import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { ApexOptions } from 'apexcharts';

const ChartOne: React.FC = () => {
  const [series, setSeries] = useState([
    { name: 'Revenues', data: [] },
    { name: 'Sales', data: [] },
  ]);
  const [categories, setCategories] = useState<string[]>([]);
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

  useEffect(() => {
    fetchMonthlyData();
  }, []);

  const fetchMonthlyData = async () => {
    try {
      const response = await axios.get(
        'https://innovocode-hairsalon.com/api/Appointment/revenue-monthly',
      );
      const data = response.data;

      const categories = data.map((entry: { month: string }) => entry.month);
      const revenues = data.map(
        (entry: { totalRevenue: number }) => entry.totalRevenue,
      );
      const sales = data.map(
        (entry: { totalSales: number }) => entry.totalSales,
      );

      setCategories(categories);
      setSeries([
        { name: 'Revenues', data: revenues },
        { name: 'Sales', data: sales },
      ]);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };

  const options: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      background: 'transparent',
    },
    colors: ['#3C50E0', '#80CAEE'],
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
      borderColor: colorMode === 'dark' ? '#2D3748' : '#E5E7EB', // Dark gray in dark mode, light gray in light mode
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    markers: {
      size: 4,
      colors: '#fff',
      strokeColors: ['#3056D3', '#80CAEE'],
      strokeWidth: 2,
    },
    xaxis: {
      type: 'category',
      categories,
      labels: {
        style: {
          colors: colorMode === 'dark' ? '#FFFFFF' : '#374151', // White in dark mode, dark gray in light mode
        },
      },
    },
    yaxis: {
      title: { text: '' },
      labels: {
        style: {
          colors: colorMode === 'dark' ? '#FFFFFF' : '#374151', // White in dark mode, dark gray in light mode
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: colorMode === 'dark' ? '#FFFFFF' : '#374151', // Legend text color
      },
    },
  };

  return (
    <div
      className="p-6 rounded-lg max-w-lg mx-auto border border-gray-300 dark:border-gray-700"
      style={{
        backgroundColor: colorMode === 'dark' ? 'transparent' : '#FFFFFF', // Transparent in dark mode, white in light mode
        maxWidth: '900px',
      }}
    >
      <h2
        className="text-xl font-semibold text-center mb-4"
        style={{
          color: colorMode === 'dark' ? '#FFFFFF' : '#374151', // Adapt heading color to mode
        }}
      >
        Monthly Revenue and Sales
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
