"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

interface OrderItem {
  _id: string;
  type: string;
  name: string;
  image: string;
  quantity: number;
  size: string;
  price: number;
}

interface Order {
  _id: string;
  name: string;
  email: string;
  order: OrderItem[];
  status: "pending" | "processing" | "completed" | "cancelled";
  total: number;
  createdAt: string;
}

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const fetchRecentOrders = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/order?limit=5&sort=-createdAt`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data.slice(0, 5) || []);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRecentOrders();
    }
  }, [token]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Package className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-6 dark:bg-gray-700"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2 dark:bg-gray-700"></div>
                  <div className="h-3 bg-gray-200 rounded w-32 dark:bg-gray-700"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16 dark:bg-gray-700"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Recent Orders
        </h3>
        <Link
          href="/orders"
          className="text-sm text-cream-600 hover:text-cream-700 dark:text-cream-400 dark:hover:text-cream-300 font-medium"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No recent orders</p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-cream-100 rounded-lg dark:bg-cream-900/20">
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-800 dark:text-white/90">
                      {order.name}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{order.order.length} item{order.order.length > 1 ? 's' : ''}</span>
                    <span>•</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800 dark:text-white/90">
                  £{order.total.toFixed(2)}
                </p>
                <Link
                  href={`/orders`}
                  className="text-xs text-cream-600 hover:text-cream-700 dark:text-cream-400 dark:hover:text-cream-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {orders.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Showing {orders.length} recent orders
            </span>
            <Link
              href="/orders"
              className="inline-flex items-center text-cream-600 hover:text-cream-700 dark:text-cream-400 dark:hover:text-cream-300 font-medium"
            >
              View All Orders →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
