/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";

export default function CreateOrder({ vendorId, userId }: { vendorId: string; userId: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<{ productId: string; qty: number; note?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountValue, setDiscountValue] = useState(0);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  // Add item to cart (or increase qty)
  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { productId, qty: 1 }];
    });
    setCartOpen(true);
  };

  // Decrease quantity or remove
  const decreaseQty = (productId: string) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.productId === productId ? { ...i, qty: i.qty - 1 } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find((p) => p._id === item.productId);
    return sum + (product?.pricing?.basePrice || 0) * item.qty;
  }, 0);

  const grandTotal = subtotal - discountValue;

  // Handle discount check
  const applyDiscount = async () => {
    try {
      const res = await fetch("/api/discounts/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountCode, subtotal }),
      });

      const data = await res.json();
      if (res.ok) {
        setDiscountValue(data.amount || 0);
        alert("Discount applied!");
      } else {
        setDiscountValue(0);
        alert("Invalid discount code");
      }
    } catch (err) {
      console.error("Discount error", err);
      alert("Error applying discount");
    }
  };

  // Place order
  const handleSubmit = async () => {
    setLoading(true);

    const body = {
      vendorId,
      placedBy: userId,
      totals: {
        subtotal,
        discount: discountValue,
        grandTotal,
        currency: "USD",
      },
      items: cart,
    };
console.log("Submitting order:", body);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      
    });
    setLoading(false);
    if (res.ok) {
      alert("Order placed!");
      setCart([]);
      setDiscountCode("");
      setDiscountValue(0);
      setCartOpen(false);
    } else {
      const err = await res.json();
      alert("Error: " + err.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <header className="bg-white shadow-sm rounded-lg p-4 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-teal-700">MediQuick Delivery</h1>
        <div className="flex items-center">
          <button 
            onClick={() => setCartOpen(!cartOpen)}
            className="relative bg-teal-600 text-white p-2 rounded-full mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.reduce((total, item) => total + item.qty, 0)}
              </span>
            )}
          </button>
          <span className="text-gray-600">User ID: {userId.slice(0, 6)}...</span>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Products List */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Available Medications</h2>
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search medications..." 
                  className="bg-transparent border-none focus:ring-0 text-sm ml-2"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p._id} className="border rounded-lg p-4 transition-all hover:shadow-md">
                  <div className="h-32 bg-teal-50 rounded-lg flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-3 0H8m5 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900">{p.name}</h3>
                  <p className="text-xs text-teal-600 bg-teal-50 inline-block px-2 py-1 rounded-full mt-1">{p.category}</p>
                  <p className="font-semibold text-teal-700 mt-2">${p.pricing.basePrice}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">In stock</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => decreaseQty(p._id)}
                        className="bg-gray-200 text-gray-700 p-1 rounded-full hover:bg-gray-300 transition-colors"
                        aria-label={`Decrease quantity of ${p.name}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <button
                        onClick={() => addToCart(p._id)}
                        className="bg-teal-600 text-white p-1 rounded-full hover:bg-teal-700 transition-colors"
                        aria-label={`Add ${p.name} to cart`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className={`lg:w-96 w-full ${cartOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Your Order</h2>
              <button 
                onClick={() => setCartOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
                aria-label="Close cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-gray-500 mt-2">Your cart is empty</p>
                <p className="text-sm text-gray-400">Add medications from the list</p>
              </div>
            ) : (
              <>
                <div className="max-h-96 overflow-y-auto pr-2">
                  <ul className="space-y-3">
                    {cart.map((item, idx) => {
                      const product = products.find((p) => p._id === item.productId);
                      return (
                        <li key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="block font-medium text-gray-900">{product?.name}</span>
                            <span className="text-sm text-gray-500">${product?.pricing?.basePrice} each</span>
                          </div>
                          <div className="flex items-center">
                            <button 
                              onClick={() => decreaseQty(item.productId)}
                              className="text-gray-500 hover:text-teal-700 p-1"
                              aria-label="Decrease quantity"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                            <span className="mx-2 font-medium">{item.qty}</span>
                            <button 
                              onClick={() => addToCart(item.productId)}
                              className="text-gray-500 hover:text-teal-700 p-1"
                              aria-label="Increase quantity"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          </div>
                          <span className="font-semibold">${(product?.pricing?.basePrice || 0) * item.qty}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Discount Section */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-2">Apply Discount</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      aria-label="Discount code"
                    />
                    <button
                      onClick={applyDiscount}
                      className="bg-teal-100 text-teal-700 px-4 py-2 rounded-lg hover:bg-teal-200 transition-colors"
                      aria-label="Apply discount"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Totals */}
                <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-green-600">-${discountValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2">
                    <span className="text-gray-800">Grand Total:</span>
                    <span className="text-teal-700">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                  aria-label="Place your order"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>Place Your Order</>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile cart button */}
      {!cartOpen && (
        <div className="lg:hidden fixed bottom-4 right-4">
          <button 
            onClick={() => setCartOpen(true)}
            className="bg-teal-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
            aria-label="Open cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.reduce((total, item) => total + item.qty, 0)}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}