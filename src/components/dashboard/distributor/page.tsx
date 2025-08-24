"use client";
import AddDrugForm from "@/components/forms/AddDrugForm";
import ReceivedOrders from "@/components/forms/ReceivedOrders";
import React from "react";

export default function DistributorDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Distributor Dashboard</h2>
      <p className="text-gray-700">Manage and verify incoming vendor orders.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="font-bold">Incoming Orders</h3>
          <p className="text-sm text-gray-600">Review and process vendor requests.</p>
          <ReceivedOrders/>
        </div>
       
        <div className="p-4 bg-white shadow rounded-lg">
          <AddDrugForm /> {/* ✅ helper component */}
        </div>
      </div>
    </div>
  );
}
