/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";

export default function MyOrders({ vendorId }: { vendorId: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders?vendorId=${vendorId}`);
        const data = await res.json();
        console.log("Fetched orders:", data);
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [vendorId]);

  // Filter orders based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        (order) =>
          order.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.paymentStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.totals?.grandTotal?.toString().includes(searchTerm)
      );
      setFilteredOrders(filtered);
    }
  }, [searchTerm, orders]);

  // Function to determine status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-cyan-100 text-cyan-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to handle view details
  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-2xl text-gray-800">My Orders</h3>
        <div className="flex items-center space-x-2">
          <span className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full">
            {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search orders by code, status, or amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 p-4 rounded-xl animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-10">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          {searchTerm ? (
            <>
              <p className="text-gray-500 font-medium">No orders found</p>
              <p className="text-sm text-gray-400 mt-1">Try a different search term or clear your search</p>
              <button 
                onClick={() => setSearchTerm("")}
                className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear search
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-500 font-medium">No orders yet</p>
              <p className="text-sm text-gray-400 mt-1">Orders will appear here once placed</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((o) => (
            <div key={o._id} className="border border-gray-200 p-5 rounded-xl hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-800">Order #{o.code}</p>
                  <p className="text-sm text-gray-500">{new Date(o.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(o.status)}`}>
                  {o.status.toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500">Payment</p>
                  <p className="text-sm font-medium text-gray-800">{o.paymentStatus || "Pending"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Items</p>
                  <p className="text-sm font-medium text-gray-800">{o.items?.length || 0} items</p>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="text-lg font-bold text-blue-600">
                    {o.totals?.grandTotal} {o.totals?.currency}
                  </p>
                </div>
                <button 
                  onClick={() => handleViewDetails(o)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center"
                >
                  View Details 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Order Code</h4>
                  <p className="text-lg font-semibold text-gray-700">#{selectedOrder.code}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Order Date</h4>
                  <p className="text-lg text-gray-800">{new Date(selectedOrder.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                  <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Payment Status</h4>
                  <p className="text-lg text-gray-700">{selectedOrder.paymentStatus || "Pending"}</p>
                </div>
              </div>

              {/* <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.product?.name || `Item ${index + 1}`}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} • {item.price} {selectedOrder.totals?.currency}</p>
                      </div>
                      <p className="font-semibold">{(item.quantity * item.price).toFixed(2)} {selectedOrder.totals?.currency}</p>
                    </div>
                  ))}
                </div>
              </div> */}

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium text-gray-800">{selectedOrder.totals?.subtotal} {selectedOrder.totals?.currency}</p>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-600">Tax</p>
                  <p className="font-medium text-gray-800">{selectedOrder.totals?.tax} {selectedOrder.totals?.currency}</p>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium text-gray-800">{selectedOrder.totals?.shipping} {selectedOrder.totals?.currency}</p>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <p className="text-lg font-semibold text-black">Total</p>
                  <p className="text-lg font-bold text-blue-600">
                    {selectedOrder.totals?.grandTotal} {selectedOrder.totals?.currency}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}