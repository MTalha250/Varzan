"use client";
import React, { useEffect, useState } from "react";
import { Package, ShoppingCart, MessageSquare, CreditCard, DollarSign, Users, TrendingUp, TrendingDown } from "lucide-react";
import axios from "axios";
import useAuthStore from "@/store/authStore";

interface DashboardStats {
  productCount: number;
  orderCount: number;
  contactCount: number;
  totalPayments: number;
  successfulPayments: number;
  pendingPayments: number;
  failedPayments: number;
  totalRevenue: number;
  adminCount: number;
  categoryCount: number;
  highlightedProductCount: number;
}

export const Metrics = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(response.data);
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

  const getSuccessRate = () => {
    if (!stats || stats.totalPayments === 0) return 0;
    return ((stats.successfulPayments / stats.totalPayments) * 100).toFixed(1);
  };

  const metrics = [
    {
      title: "Total Products",
      value: stats?.productCount || 0,
      icon: Package,
      color: "blue",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      description: "Total Products",
    },
    {
      title: "Highlighted Products",
      value: stats?.highlightedProductCount || 0,
      icon: TrendingUp,
      color: "yellow",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      description: "Featured on homepage",
    },
    {
      title: "Categories",
      value: stats?.categoryCount || 0,
      icon: Users,
      color: "indigo",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      description: "Product categories",
    },
    {
      title: "Enquiries",
      value: stats?.contactCount || 0,
      icon: MessageSquare,
      color: "purple",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      description: "Customer enquiries",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="rounded-2xl space-y-4 border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700"></div>
              <div className="w-4 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-20"></div>
              <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-16"></div>
              <div className="h-3 bg-gray-200 rounded dark:bg-gray-700 w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        
        return (
          <div key={index} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${metric.bgColor}`}>
                <Icon className={`${metric.iconColor}`} size={20} />
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {metric.title}
              </h3>
              <div className="flex items-baseline space-x-1">
                <h4 className="font-bold text-gray-800 dark:text-white/90 text-2xl">
                  {metric.value}
                </h4>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {metric.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
