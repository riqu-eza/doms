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
  // 🔹 Fake IDs for now, replace with actual auth/user context later
  const { user, loading, logout } = useUser();
  if (!user) {
    return (
      <div>
        <p className="text-red-600">
          Error: User not found. Please log in again.
        </p>
        <button
          onClick={logout}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }
  const userId = user.userId;
  const vendorId = user.vendorId;

  if (loading) return <div>Loading...</div>;
 

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Vendor Dashboard</h2>
      <p className="text-gray-700">Welcome! Here you can manage your orders.</p>
<div>
  <button
          onClick={logout}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Log out
        </button>
</div>
      {/* 🔹 Tab Switcher */}
      {selectedTab === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => setSelectedTab("createOrder")}
            className="p-4 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <h3 className="font-bold">Create Order</h3>
            <p className="text-sm text-gray-600">Place new medicine orders.</p>
          </div>

          <div
            onClick={() => setSelectedTab("myOrders")}
            className="p-4 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <h3 className="font-bold">My Orders</h3>
            <p className="text-sm text-gray-600">
              Track your submitted orders.
            </p>
          </div>

          <div
            onClick={() => setSelectedTab("profile")}
            className="p-4 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <h3 className="font-bold">Profile</h3>
            <p className="text-sm text-gray-600">Manage your vendor info.</p>
          </div>
        </div>
      )}

      {/* 🔹 Profile Section */}
      {selectedTab === "profile" && (
        <div>
          <button
            onClick={() => setSelectedTab("dashboard")}
            className="mb-4 text-blue-600 underline"
          >
            ← Back to Dashboard
          </button>
          <VendorProfile userId={userId} />
        </div>
      )}

      {/* 🔹 Create Order Section */}
      {selectedTab === "createOrder" && (
        <div>
          <button
            onClick={() => setSelectedTab("dashboard")}
            className="mb-4 text-blue-600 underline"
          >
            ← Back to Dashboard
          </button>
          <CreateOrder vendorId={vendorId!} userId={userId} />
        </div>
      )}

      {/* 🔹 My Orders Section */}
      {selectedTab === "myOrders" && (
        <div>
          <button
            onClick={() => setSelectedTab("dashboard")}
            className="mb-4 text-blue-600 underline"
          >
            ← Back to Dashboard
          </button>
          <MyOrders vendorId={vendorId!} />
        </div>
      )}
    </div>
  );
}
