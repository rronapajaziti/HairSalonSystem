import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { ApexOptions } from "apexcharts";

const ChartOne: React.FC = () => {
  const [series, setSeries] = useState([
    { name: "Revenues", data: [] },
    { name: "Sales", data: [] },
  ]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchMonthlyData();
  }, []);

  const fetchMonthlyData = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7158/api/Appointment/revenue-monthly"
      );
      const data = response.data;

      const categories = data.map((entry: { month: string }) => entry.month);
      const revenues = data.map((entry: { totalRevenue: number }) => entry.totalRevenue);
      const sales = data.map((entry: { totalSales: number }) => entry.totalSales);

      setCategories(categories);
      setSeries([
        { name: "Revenues", data: revenues },
        { name: "Sales", data: sales },
      ]);
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    }
  };

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 250,
      toolbar: { show: false },
    },
    colors: ["#3C50E0", "#80CAEE"],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    grid: {
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    markers: {
      size: 3,
      colors: "#fff",
      strokeColors: ["#3056D3", "#80CAEE"],
      strokeWidth: 2,
    },
    xaxis: {
      type: "category",
      categories,
    },
    yaxis: {
      title: { text: "" },
      min: 0,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
  };

  return (
    <div
  style={{
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "20px",
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
        Monthly Revenue and Sales
      </h2>
      <ReactApexChart options={options} series={series} type="area" height={250} />
    </div>
  );
};

export default ChartOne;
