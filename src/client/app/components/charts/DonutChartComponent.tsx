"use client";
import React from "react";
import Chart from "react-apexcharts";

type Props = {
  title: string;
  data: number[];
  labels: string[];
  colorScheme?: string[];
};

const DonutChartComponent: React.FC<Props> = ({
  title,
  data,
  labels,
  colorScheme = ["#f59e0b", "#10b981", "#6366f1", "#ec4899"],
}) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      id: "donut-chart",
      background: "transparent",
      zoom: { enabled: false },
    },
    colors: colorScheme,
    dataLabels: { enabled: true, style: { fontSize: "11px", fontFamily: "inherit" } },
    stroke: {
      width: 2,
      colors: ["#0d0d21"],
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              color: "#f1f5f9",
              fontSize: "13px",
              fontFamily: "inherit",
              fontWeight: 700,
            },
          },
        },
      },
    },
    legend: {
      position: "bottom",
      labels: {
        colors: "#94a3b8",
      },
    },
    tooltip: {
      theme: "dark",
    },
    labels: labels,
  };

  const series = data;

  return (
    <div className="p-5 sm:p-6 rounded-2xl shadow-xl w-full bg-slate-900/70 backdrop-blur-xl border border-white/10">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-slate-100 text-base sm:text-lg font-bold tracking-tight">{title}</h2>
      </div>
      <Chart options={options} series={series} type="donut" height={280} />
    </div>
  );
};

export default DonutChartComponent;
