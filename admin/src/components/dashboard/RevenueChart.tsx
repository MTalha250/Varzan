"use client";
import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import axios from "axios";
import useAuthStore from "@/store/authStore";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface MonthlyRevenue {
  _id: {
    year: number;
    month: number;
  };
  revenue: number;
  count: number;
}

export default function RevenueChart() {
  const [monthlyData, setMonthlyData] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMonthlyData(response.data.monthlyRevenue || []);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardStats();
    }
  }, [token]);

  // Process data for the last 12 months
  const processChartData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = new Date();
    const last12Months = [];
    
    // Generate last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(currentDate.getMonth() - i);
      last12Months.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        label: months[date.getMonth()],
      });
    }

    // Map revenue data to months
    const revenueData = last12Months.map(monthInfo => {
      const matchingData = monthlyData.find(data => 
        data._id.year === monthInfo.year && data._id.month === monthInfo.month
      );
      return matchingData ? matchingData.revenue : 0;
    });

    const orderCountData = last12Months.map(monthInfo => {
      const matchingData = monthlyData.find(data => 
        data._id.year === monthInfo.year && data._id.month === monthInfo.month
      );
      return matchingData ? matchingData.count : 0;
    });

    return {
      categories: last12Months.map(m => m.label),
      revenueData,
      orderCountData,
    };
  };

  const chartData = processChartData();

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    colors: ["#f8f4dc", "#d4ba7a"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: [3, 3],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.4,
        opacityTo: 0.1,
      },
    },
    markers: {
      size: 4,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
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
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        format: "MMM",
      },
      y: {
        formatter: function(val: number, opts: any) {
          if (opts.seriesIndex === 0) {
            return `£${val.toFixed(2)}`;
          }
          return `${val} orders`;
        }
      }
    },
    xaxis: {
      categories: chartData.categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: [
      {
        title: {
          text: "Revenue (£)",
          style: {
            fontSize: "12px",
            color: "#6B7280",
          },
        },
        labels: {
          style: {
            fontSize: "12px",
            colors: ["#6B7280"],
          },
          formatter: function(val: number) {
            return `£${val.toFixed(0)}`;
          }
        },
      },
      {
        opposite: true,
        title: {
          text: "Orders",
          style: {
            fontSize: "12px",
            color: "#6B7280",
          },
        },
        labels: {
          style: {
            fontSize: "12px",
            colors: ["#6B7280"],
          },
        },
      }
    ],
  };

  const series = [
    {
      name: "Revenue",
      data: chartData.revenueData,
      yAxisIndex: 0,
    },
    {
      name: "Orders",
      data: chartData.orderCountData,
      yAxisIndex: 1,
    },
  ];

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-2 dark:bg-gray-700"></div>
        <div className="h-4 bg-gray-200 rounded w-48 mb-6 dark:bg-gray-700"></div>
        <div className="h-80 bg-gray-200 rounded dark:bg-gray-700"></div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-2 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Revenue & Orders Overview
        </h3>
        <p className="text-gray-500 text-sm dark:text-gray-400">
          Monthly revenue and order trends for the last 12 months
        </p>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[800px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
} 