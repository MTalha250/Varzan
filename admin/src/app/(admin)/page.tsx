import { Metrics } from "@/components/dashboard/Metrics";
import React from "react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back! Here's what's happening at Varzan.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="col-span-12">
        <Metrics />
      </div>
    </div>
  );
}
