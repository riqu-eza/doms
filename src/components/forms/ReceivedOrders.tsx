/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";

export default function ReceivedOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        console.log("Fetched orders:", data);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        // Update the local state to reflect the change
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        
        alert(`Order status updated to ${newStatus}`);
      } else {
        alert("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'PROCESSING': return 'bg-purple-100 text-purple-800';
      case 'SHIPPED': return 'bg-teal-100 text-teal-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
          <svg className="animate-spin h-12 w-12 text-teal-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <header className="bg-white shadow-sm rounded-lg p-4 md:p-6 mb-6">
        <h1 className="text-2xl font-bold text-teal-700">Received Orders</h1>
        <p className="text-gray-600 mt-1">Manage and track all orders sent to you</p>
      </header>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No orders received yet</h3>
          <p className="mt-2 text-gray-500">Orders placed with your vendor account will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Orders</h3>
                <p className="mt-1 text-sm text-gray-500">A list of all orders received by your vendor account.</p>
              </div>
              <ul className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <li key={order._id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold text-teal-700 truncate">{order.code}</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {order.totals.grandTotal} {order.totals.currency}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex flex-col gap-2">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-sm font-medium text-teal-600 hover:text-teal-900"
                        >
                          View Details
                        </button>
                        {order.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateOrderStatus(order._id, 'CONFIRMED')}
                              className="text-xs font-medium text-green-600 hover:text-green-900"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order._id, 'CANCELLED')}
                              className="text-xs font-medium text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Details Sidebar */}
          <div className={`lg:col-span-1 ${detailOpen ? 'block' : 'hidden'} lg:block`}>
            {selectedOrder ? (
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 sticky top-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
                  <button 
                    onClick={() => setDetailOpen(false)}
                    className="lg:hidden text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-700">{selectedOrder.code}</h4>
                  <p className="text-sm text-gray-500">Placed on {formatDate(selectedOrder.createdAt)}</p>
                  <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Order Items</h4>
                  <ul className="space-y-2">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span>Product ID: {item.productId}</span>
                        <span>Qty: {item.qty}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Payment Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>Ksh{selectedOrder.totals.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span>Ksh{selectedOrder.totals.discount}</span>
                    </div>
                    {selectedOrder.totals.tax > 0 && (
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>Ksh{selectedOrder.totals.tax}</span>
                      </div>
                    )}
                    {selectedOrder.totals.shipping > 0 && (
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>Ksh{selectedOrder.totals.shipping}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium pt-2 border-t border-gray-200">
                      <span>Grand Total:</span>
                      <span className="text-teal-700">Ksh{selectedOrder.totals.grandTotal}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Update Status</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateOrderStatus(selectedOrder._id, 'CONFIRMED')}
                      disabled={selectedOrder.status !== 'PENDING'}
                      className={`px-3 py-2 text-xs font-medium rounded ${selectedOrder.status !== 'PENDING' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder._id, 'PROCESSING')}
                      disabled={!['CONFIRMED', 'PENDING'].includes(selectedOrder.status)}
                      className={`px-3 py-2 text-xs font-medium rounded ${!['CONFIRMED', 'PENDING'].includes(selectedOrder.status) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                    >
                      Process
                    </button>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder._id, 'SHIPPED')}
                      disabled={!['PROCESSING', 'CONFIRMED'].includes(selectedOrder.status)}
                      className={`px-3 py-2 text-xs font-medium rounded ${!['PROCESSING', 'CONFIRMED'].includes(selectedOrder.status) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-teal-100 text-teal-700 hover:bg-teal-200'}`}
                    >
                      Ship
                    </button>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder._id, 'DELIVERED')}
                      disabled={selectedOrder.status !== 'SHIPPED'}
                      className={`px-3 py-2 text-xs font-medium rounded ${selectedOrder.status !== 'SHIPPED' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                    >
                      Deliver
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-4 text-sm font-medium text-gray-900">No order selected</h3>
                <p className="mt-2 text-sm text-gray-500">Select an order from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}