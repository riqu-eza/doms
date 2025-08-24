/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";

export default function MyOrders({ vendorId }: { vendorId: string }) {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(`/api/orders?vendorId=${vendorId}`);
      const data = await res.json();
      setOrders(data);
    };
    fetchOrders();
  }, [vendorId]);

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="font-bold text-lg mb-2">My Orders</h3>

      {orders.length === 0 ? (
        <p className="text-sm text-gray-500">No orders yet</p>
      ) : (
        <div className="space-y-2">
          {orders.map((o) => (
            <div key={o._id} className="border p-2 rounded">
              <p className="font-medium">Order #{o.code}</p>
              <p className="text-sm text-gray-600">Status: {o.status}</p>
              <p className="text-sm text-gray-600">
                Total: {o.totals.grandTotal} {o.totals.currency}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
