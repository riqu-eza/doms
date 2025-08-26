"use client";
import { useUser } from "@/app/context/UserContext";
import CreateOrder from "@/components/forms/CreateOrder";
import MyOrders from "@/components/forms/MyOrders";
import VendorProfile from "@/components/forms/VendorProfile";
import React, { useState } from "react";

export default function VendorDashboard() {
  const [selectedTab, setSelectedTab] = useState<
    "dashboard" | "profile" | "createOrder" | "myOrders"
  >("dashboard");
  
  const { user, loading, logout } = useUser();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-center text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-center text-red-600 font-medium mb-4">
          Error: User not found. Please log in again.
        </p>
        <button
          onClick={logout}
          className="w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const userId = user.userId;
  const vendorId = user.vendorId;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center space-y-1 bg-white p-6 rounded-xl shadow-sm">
        <div className=""> 
          <h2 className="text-2xl font-bold text-gray-800">Vendor Dashboard</h2>
          <p className="text-gray-600">Welcome! Here you can manage your orders.</p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Log out
        </button>
      </div>

      {/* Tab Switcher */}
      {selectedTab === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => setSelectedTab("createOrder")}
            className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition group"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-100 text-teal-600 mb-4 group-hover:bg-teal-600 group-hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 group-hover:text-teal-700 transition">Create Order</h3>
            <p className="text-sm text-gray-600">Place new medicine orders.</p>
          </div>

          <div
            onClick={() => setSelectedTab("myOrders")}
            className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition group"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 group-hover:text-blue-700 transition">My Orders</h3>
            <p className="text-sm text-gray-600">Track your submitted orders.</p>
          </div>

          <div
            onClick={() => setSelectedTab("profile")}
            className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition group"
          >
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-2 group-hover:text-purple-700 transition">Profile</h3>
            <p className="text-sm text-gray-600">Manage your vendor info.</p>
          </div>
        </div>
      )}

      {/* Profile Section */}
      {selectedTab === "profile" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <button
            onClick={() => setSelectedTab("dashboard")}
            className="flex items-center text-teal-600 hover:text-teal-800 transition mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          <VendorProfile userId={userId} />
        </div>
      )}

      {/* Create Order Section */}
      {selectedTab === "createOrder" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <button
            onClick={() => setSelectedTab("dashboard")}
            className="flex items-center text-teal-600 hover:text-teal-800 transition mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          <CreateOrder vendorId={vendorId!} userId={userId} />
        </div>
      )}

      {/* My Orders Section */}
      {selectedTab === "myOrders" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <button
            onClick={() => setSelectedTab("dashboard")}
            className="flex items-center text-teal-600 hover:text-teal-800 transition mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          <MyOrders vendorId={vendorId!} />
        </div>
      )}
    </div>
  );
}