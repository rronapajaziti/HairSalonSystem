import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { startOfWeek, endOfWeek } from 'date-fns';

const ChartTwo: React.FC = () => {
  const [currentWeekProfit, setCurrentWeekProfit] = useState<number>(0);

  const fetchWeeklyData = async () => {
    try {
      const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
      const endOfCurrentWeek = endOfWeek(new Date(), { weekStartsOn: 1 });

      const response = await axios.get(
        `https://localhost:7158/api/Appointment/total-revenue?startDate=${startOfCurrentWeek.toISOString()}&endDate=${endOfCurrentWeek.toISOString()}`
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
      height: 400,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 6,
      },
    },
    grid: {
      borderColor: '#D1D5DB', 
      strokeDashArray: 4, 
      xaxis: {
        lines: {
          show: false, 
        },
      },
      yaxis: {
        lines: {
          show: true, 
        },
      },
    },
    xaxis: {
      categories: ['Current Week'], 
      labels: {
        style: {
          fontSize: '14px',
          colors: ['#6B7280'],
        },
      },
    },
    yaxis: {
      title: {
        text: 'Profit (€)',
        style: {
          fontSize: '14px',
          color: '#374151', 
        },
      },
      labels: {
        formatter: (value: number) => `${value.toFixed(2)}€`,
        style: {
          fontSize: '12px',
          colors: ['#374151'],
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#2563EB'], 
  };

  const series = [
    {
      name: 'Profit',
      data: [currentWeekProfit],
    },
  ];

  return (
    <div className="p-6 rounded-lg border border-gray-300 bg-white shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Weekly Profit</h2>
      <p className="text-gray-600 mb-6">
        <strong>Current Week Profit:</strong> {currentWeekProfit.toFixed(2)}€
      </p>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={400}
        width="100%" 
      />
    </div>
  );
};

export default ChartTwo;
