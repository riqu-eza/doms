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
    <div className="flex">
      {/* Products List */}
      <div className="flex-1 p-4">
        <h3 className="font-bold text-lg mb-2">Products</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p._id} className="p-3 border rounded shadow-sm">
              <h4 className="font-medium">{p.name}</h4>
              <p className="text-sm text-gray-600">{p.category}</p>
              <p className="font-semibold">${p.pricing.basePrice}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => addToCart(p._id)}
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => decreaseQty(p._id)}
                  className="bg-gray-300 px-2 py-1 rounded"
                >
                  –
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="w-80 bg-white shadow-lg border-l p-4 fixed right-0 top-0 h-full">
          <h3 className="font-bold text-lg mb-3">Cart</h3>
          {cart.length === 0 ? (
            <p className="text-sm text-gray-500">No items</p>
          ) : (
            <ul className="space-y-2">
              {cart.map((item, idx) => {
                const product = products.find((p) => p._id === item.productId);
                return (
                  <li key={idx} className="flex justify-between text-sm">
                    <span>
                      {product?.name} × {item.qty}
                    </span>
                    <span>${(product?.pricing?.basePrice || 0) * item.qty}</span>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Discount */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Discount Code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="border p-2 w-full rounded"
            />
            <button
              onClick={applyDiscount}
              className="mt-2 bg-yellow-500 text-white w-full p-2 rounded"
            >
              Apply Discount
            </button>
          </div>

          {/* Totals */}
          <div className="mt-4 border-t pt-3 text-sm">
            <p>Subtotal: ${subtotal}</p>
            <p>Discount: -${discountValue}</p>
            <p className="font-bold">Grand Total: ${grandTotal}</p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 bg-green-600 text-white w-full p-2 rounded"
          >
            {loading ? "Placing..." : "Place Order"}
          </button>
        </div>
      )}
    </div>
  );
}
