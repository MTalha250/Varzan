"use client";
import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import axios from "axios";
import useAuthStore from "@/store/authStore";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface PaymentStats {
  totalPayments: number;
  successfulPayments: number;
  pendingPayments: number;
  failedPayments: number;
}

export default function PaymentStatusChart() {
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPaymentStats({
        totalPayments: response.data.totalPayments || 0,
        successfulPayments: response.data.successfulPayments || 0,
        pendingPayments: response.data.pendingPayments || 0,
        failedPayments: response.data.failedPayments || 0,
      });
    } catch (error) {
      console.error("Error fetching payment stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardStats();
    }
  }, [token]);

  const getChartData = () => {
    if (!paymentStats) return { series: [], labels: [] };

    const data = [
      { label: "Successful", value: paymentStats.successfulPayments, color: "#10B981" },
      { label: "Pending", value: paymentStats.pendingPayments, color: "#F59E0B" },
      { label: "Failed", value: paymentStats.failedPayments, color: "#EF4444" },
    ];

    return {
      series: data.map(item => item.value),
      labels: data.map(item => item.label),
      colors: data.map(item => item.color),
    };
  };

  const chartData = getChartData();

  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
    },
    colors: chartData.colors,
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontFamily: "Outfit",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Total",
              fontSize: "16px",
              fontWeight: 600,
              color: "#374151",
              formatter: function () {
                return paymentStats?.totalPayments?.toString() || "0";
              },
            },
            value: {
              show: true,
              fontSize: "14px",
              fontWeight: 400,
              color: "#6B7280",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    tooltip: {
      y: {
        formatter: function (val: number) {
          const percentage = paymentStats?.totalPayments 
            ? ((val / paymentStats.totalPayments) * 100).toFixed(1)
            : "0";
          return `${val} (${percentage}%)`;
        }
      }
    },
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-2 dark:bg-gray-700"></div>
        <div className="h-4 bg-gray-200 rounded w-48 mb-6 dark:bg-gray-700"></div>
        <div className="h-64 bg-gray-200 rounded dark:bg-gray-700 mx-auto w-64"></div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-2 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Payment Status Distribution
        </h3>
        <p className="text-gray-500 text-sm dark:text-gray-400">
          Breakdown of all payment statuses
        </p>
      </div>

      <div className="flex justify-center">
        <ReactApexChart
          options={options}
          series={chartData.series}
          type="donut"
          height={280}
        />
      </div>

      {/* Payment Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">Success Rate</div>
          <div className="text-lg font-semibold text-green-600 dark:text-green-400">
            {paymentStats && paymentStats.totalPayments > 0
              ? `${((paymentStats.successfulPayments / paymentStats.totalPayments) * 100).toFixed(1)}%`
              : "0%"
            }
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">Pending</div>
          <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
            {paymentStats?.pendingPayments || 0}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">Failed</div>
          <div className="text-lg font-semibold text-red-600 dark:text-red-400">
            {paymentStats?.failedPayments || 0}
          </div>
        </div>
      </div>
    </div>
  );
} 