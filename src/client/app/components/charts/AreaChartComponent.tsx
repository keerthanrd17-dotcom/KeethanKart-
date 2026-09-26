"use client";
import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import Chart from "react-apexcharts";

type Props = {
  title: string;
  data: number[];
  categories: string[];
  color?: string;
  percentageChange?: number;
};

const AreaChartComponent: React.FC<Props> = ({
  title,
  data,
  categories,
  color = "#f59e0b",
  percentageChange,
}) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      id: "area-chart",
      background: "transparent",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: [color],
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.5,
        opacityFrom: 0.55,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories,
      labels: { style: { colors: "#94a3b8", fontSize: "12px", fontFamily: "inherit" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#94a3b8", fontSize: "12px", fontFamily: "inherit" },
        formatter: (val: number) => {
          if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
          if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
          return `₹${val}`;
        },
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number) => `₹${val.toLocaleString("en-IN")}`,
      },
    },
    grid: {
      borderColor: "rgba(255, 255, 255, 0.06)",
      strokeDashArray: 4,
    },
  };

  const series = [
    {
      name: title,
      data,
    },
  ];

  return (
    <div className="p-5 sm:p-6 rounded-2xl shadow-xl w-full bg-slate-900/70 backdrop-blur-xl border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-slate-100 text-base sm:text-lg font-bold tracking-tight">
          {title}
        </h2>
        {percentageChange !== undefined && (
          <span
            className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${
              percentageChange >= 0
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {percentageChange >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
            )}
            {Math.abs(percentageChange)}% vs last month
          </span>
        )}
      </div>
      <Chart options={options} series={series} type="area" height={300} />
    </div>
  );
};

export default AreaChartComponent;
