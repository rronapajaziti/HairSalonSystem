import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { startOfWeek, endOfWeek } from "date-fns";

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
      console.error("Error fetching weekly profit data:", error);
    }
  };

  useEffect(() => {
    fetchWeeklyData();
  }, []);

  const options = {
    chart: {
      type: "bar",
      height: 250,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: { columnWidth: "50%", borderRadius: 4 },
    },
    xaxis: {
      categories: ["Current Week"],
    },
    yaxis: {
      title: { text: "Profit (€)" },
    },
    dataLabels: { enabled: false },
    colors: ["#2563EB"],
  };

  const series = [{ name: "Profit", data: [currentWeekProfit] }];

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "20px",
        maxWidth: "450px",
        margin: "16px auto",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "#374151",
          textAlign: "center",
          marginBottom: "12px",
        }}
      >
        Weekly Profit
      </h2>
      <ReactApexChart options={options} series={series} type="bar" height={250} />
    </div>
  );
};

export default ChartTwo;
