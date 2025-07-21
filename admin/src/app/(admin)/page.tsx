import { Metrics } from "@/components/dashboard/Metrics";
import React from "react";
import RevenueChart from "@/components/dashboard/RevenueChart";
import PaymentStatusChart from "@/components/dashboard/PaymentStatusChart";
import RecentOrders from "@/components/dashboard/RecentOrders";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back! Here's what's happening at Cosmicway Studio.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="col-span-12">
        <Metrics />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Takes 2/3 of the width */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        
        {/* Payment Status Chart - Takes 1/3 of the width */}
        <div className="lg:col-span-1">
          <PaymentStatusChart />
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="grid grid-cols-1">
        <RecentOrders />
      </div>
    </div>
  );
}
