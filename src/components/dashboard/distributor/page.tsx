"use client";
import AddDrugForm from "@/components/forms/AddDrugForm";
import ReceivedOrders from "@/components/forms/ReceivedOrders";
import React from "react";

export default function DistributorDashboard() {
  return (
    <div className="space-y-6 ">
      <div className="flex justify-between items-center space-y-1 bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800">Distributor Dashboard</h2>
      <p className="text-gray-600">Manage Products and verify incoming vendor orders.</p>
</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-100 text-blue-600 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-bold text-emerald-500 text-lg">Incoming Orders</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Review and process vendor requests.</p>
          <ReceivedOrders/>
        </div>
       
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center h-10 w-10 rounded-md bg-teal-100 text-teal-600 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-emerald-500">Add New Drug</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Manage medications to the inventory.</p>
          <AddDrugForm />
        </div>
      </div>
    </div>
  );
}