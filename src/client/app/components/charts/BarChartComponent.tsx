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

const BarChartComponent: React.FC<Props> = ({
  title,
  data,
  categories,
  percentageChange,
}) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      id: "bar-chart",
      background: "transparent",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: [
      "#f59e0b",
      "#10b981",
      "#6366f1",
      "#ec4899",
      "#3b82f6",
      "#8b5cf6",
      "#14b8a6",
      "#f97316",
      "#06b6d4",
    ],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "55%",
        distributed: true,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      width: 0,
    },
    xaxis: {
      categories,
      labels: {
        style: { colors: "#94a3b8", fontSize: "11px", fontFamily: "inherit" },
        rotate: -35,
        trim: true,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#94a3b8", fontSize: "11px", fontFamily: "inherit" },
        formatter: (val: number) => {
          if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
          if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
          return `₹${val}`;
        },
      },
    },
    legend: {
      show: false,
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
            {Math.abs(percentageChange)}%
          </span>
        )}
      </div>
      <Chart options={options} series={series} type="bar" height={320} />
    </div>
  );
};

export default BarChartComponent;
