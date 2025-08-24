"use client";
import { useState } from "react";

export default function AddDrugForm() {
  const [form, setForm] = useState({
    sku: "",
    name: "",
    description: "",
    category: "",
    subCategory: "",
    unit: "BOX",
    packSize: 1,
    regulatory: { gtin: "", drugCode: "", controlled: false },
    pricing: { basePrice: 0, tierPrices: [] as { tier: string; price: number }[] },
    trackByBatch: false,
    trackExpiry: false,
    available: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Drug added successfully!");
      setForm({ ...form, sku: "", name: "", description: "", category: "" }); // reset basic fields
    } else {
      alert("Error: " + data.error);
    }
  };

  return (
   <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded-lg space-y-3">
  <h3 className="font-bold text-lg">Add New Drug</h3>

  <div>
    <label className="block text-sm font-medium mb-1">SKU</label>
    <input
      type="text"
      placeholder="SKU"
      value={form.sku}
      onChange={(e) => setForm({ ...form, sku: e.target.value })}
      className="border p-2 w-full rounded"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Name</label>
    <input
      type="text"
      placeholder="Name"
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      className="border p-2 w-full rounded"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Description</label>
    <textarea
      placeholder="Description"
      value={form.description}
      onChange={(e) => setForm({ ...form, description: e.target.value })}
      className="border p-2 w-full rounded"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Category</label>
    <input
      type="text"
      placeholder="Category"
      value={form.category}
      onChange={(e) => setForm({ ...form, category: e.target.value })}
      className="border p-2 w-full rounded"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Unit</label>
    <select
      value={form.unit}
      onChange={(e) => setForm({ ...form, unit: e.target.value })}
      className="border p-2 w-full rounded"
    >
      <option value="BOX">Box</option>
      <option value="BOTTLE">Bottle</option>
      <option value="PACK">Pack</option>
      <option value="PIECE">Piece</option>
    </select>
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Pack Size</label>
    <input
      type="number"
      placeholder="Pack Size"
      value={form.packSize}
      onChange={(e) => setForm({ ...form, packSize: Number(e.target.value) })}
      className="border p-2 w-full rounded"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">Base Price</label>
    <input
      type="number"
      placeholder="Base Price"
      value={form.pricing.basePrice}
      onChange={(e) =>
        setForm({
          ...form,
          pricing: { ...form.pricing, basePrice: Number(e.target.value) },
        })
      }
      className="border p-2 w-full rounded"
    />
  </div>

  <label className="flex items-center space-x-2">
    <input
      type="checkbox"
      checked={form.available}
      onChange={(e) => setForm({ ...form, available: e.target.checked })}
    />
    <span>Available</span>
  </label>

  <button
    type="submit"
    className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 transition"
  >
    Save Drug
  </button>
</form>

  );
}
