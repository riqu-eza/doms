"use client";
import { useState, useEffect } from "react";

interface Drug {
  _id?: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  unit: string;
  packSize: number;
  regulatory: { gtin: string; drugCode: string; controlled: boolean };
  pricing: { basePrice: number; tierPrices: { tier: string; price: number }[] };
  trackByBatch: boolean;
  trackExpiry: boolean;
  available: boolean;
}

export default function DrugManagement() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDrug, setEditingDrug] = useState<Drug | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [form, setForm] = useState<Drug>({
    sku: "",
    name: "",
    description: "",
    category: "",
    subCategory: "",
    unit: "BOX",
    packSize: 1,
    regulatory: { gtin: "", drugCode: "", controlled: false },
    pricing: { basePrice: 0, tierPrices: [] },
    trackByBatch: false,
    trackExpiry: false,
    available: true,
  });

  // Fetch all drugs
  useEffect(() => {
    fetchDrugs();
  }, []);

  const fetchDrugs = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setDrugs(data);
    } catch (error) {
      console.error("Failed to fetch drugs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingDrug ? `/api/products/${editingDrug._id}` : "/api/products";
      const method = editingDrug ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      if (res.ok) {
        alert(editingDrug ? "Drug updated successfully!" : "Drug added successfully!");
        resetForm();
        fetchDrugs();
      } else {
        const data = await res.json();
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("An error occurred. Please try again.", );
    }
  };

  const handleEdit = (drug: Drug) => {
    setEditingDrug(drug);
    setForm(drug);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this drug?")) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        alert("Drug deleted successfully!");
        fetchDrugs();
      } else {
        const data = await res.json();
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  const resetForm = () => {
    setForm({
      sku: "",
      name: "",
      description: "",
      category: "",
      subCategory: "",
      unit: "BOX",
      packSize: 1,
      regulatory: { gtin: "", drugCode: "", controlled: false },
      pricing: { basePrice: 0, tierPrices: [] },
      trackByBatch: false,
      trackExpiry: false,
      available: true,
    });
    setEditingDrug(null);
    setShowForm(false);
  };

  const filteredDrugs = drugs.filter(drug => 
    drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drug.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-2xl text-gray-800">Drug Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {showForm ? "Cancel" : "Add New Drug"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <h3 className="font-bold text-xl text-gray-800 mb-4">{editingDrug ? "Edit Drug" : "Add New Drug"}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
              <input
                type="text"
                placeholder="SKU"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                className="w-full border border-gray-300 text-neutral-800 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 text-neutral-800 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 text-neutral-800 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <input
                type="text"
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 text-neutral-800 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Category</label>
              <input
                type="text"
                placeholder="Sub-Category"
                value={form.subCategory}
                onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 text-neutral-800 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 text-neutral-800 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="BOX">Box</option>
                <option value="BOTTLE">Bottle</option>
                <option value="PACK">Pack</option>
                <option value="PIECE">Piece</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pack Size</label>
              <input
                type="number"
                placeholder="Pack Size"
                value={form.packSize}
                onChange={(e) => setForm({ ...form, packSize: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 text-neutral-800 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (Ksh)</label>
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 text-neutral-800 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                min="0"
                step="0.01"
              />
            </div>

            <div className="md:col-span-2 flex space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => setForm({ ...form, available: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Available</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.regulatory.controlled}
                  onChange={(e) => setForm({ 
                    ...form, 
                    regulatory: { ...form.regulatory, controlled: e.target.checked } 
                  })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Controlled Substance</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
            >
              {editingDrug ? "Update Drug" : "Save Drug"}
            </button>
          </div>
        </form>
      )}

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search drugs by name, SKU or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDrugs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No drugs found. {drugs.length === 0 ? "Add your first drug to get started." : "Try a different search term."}
                </td>
              </tr>
            ) : (
              filteredDrugs.map((drug) => (
                <tr key={drug._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{drug.sku}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{drug.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{drug.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">Ksh {drug.pricing.basePrice.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${drug.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {drug.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(drug)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => drug._id && handleDelete(drug._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}