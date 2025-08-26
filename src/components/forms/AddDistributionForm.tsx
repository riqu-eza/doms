"use client";

import { useState } from "react";

export default function AddDistributionForm() {
  const [formData, setFormData] = useState({
    name: "",
    contactEmail: "",
    contactPhone: "",
    address: { line1: "", city: "", country: "", postalCode: "" },
    settings: {
      currency: "",
      timezone: "",
      invoicePrefix: "",
      webhookSecret: "",
      features: { chat: false, invoicing: false, erpSync: false },
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.currentTarget;

    if (type === "checkbox" && e.currentTarget instanceof HTMLInputElement) {
      const { checked } = e.currentTarget;
      if (name.startsWith("settings.features.")) {
        const field = name.split(".")[2];
        setFormData((prev) => ({
          ...prev,
          settings: {
            ...prev.settings,
            features: { ...prev.settings.features, [field]: checked },
          },
        }));
        return;
      }
    }

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else if (name.startsWith("settings.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        settings: { ...prev.settings, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/distributors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    alert(data.success ? "Distributor added!" : data.message);
  };

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-teal-600 py-4 px-6">
          <h2 className="text-2xl font-bold text-white">Add Distributor Organization</h2>
          <p className="text-teal-100">Medical Delivery System</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-teal-800 border-b border-teal-200 pb-2">
              Basic Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. MediCare Distributors"
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  placeholder="contact@example.com"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  placeholder="+1 (555) 123-4567"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-teal-800 border-b border-teal-200 pb-2">
              Address Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1
              </label>
              <input
                type="text"
                name="address.line1"
                placeholder="Street address"
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="address.city"
                  placeholder="City"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="address.postalCode"
                  placeholder="Postal code"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="address.country"
                placeholder="Country"
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                required
              />
            </div>
          </div>

          {/* Settings Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-teal-800 border-b border-teal-200 pb-2">
              System Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <input
                  type="text"
                  name="settings.currency"
                  placeholder="e.g., USD"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <input
                  type="text"
                  name="settings.timezone"
                  placeholder="e.g., Africa/Nairobi"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Prefix
              </label>
              <input
                type="text"
                name="settings.invoicePrefix"
                placeholder="e.g., INV-"
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              />
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-teal-800 border-b border-teal-200 pb-2">
              Features
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 transition cursor-pointer">
                <input
                  type="checkbox"
                  name="settings.features.chat"
                  onChange={handleChange}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 rounded"
                />
                <span className="ml-3 text-gray-700">Enable Chat Support</span>
              </label>

              <label className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 transition cursor-pointer">
                <input
                  type="checkbox"
                  name="settings.features.invoicing"
                  onChange={handleChange}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 rounded"
                />
                <span className="ml-3 text-gray-700">Enable Invoicing System</span>
              </label>

              <label className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 transition cursor-pointer">
                <input
                  type="checkbox"
                  name="settings.features.erpSync"
                  onChange={handleChange}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 rounded"
                />
                <span className="ml-3 text-gray-700">Enable ERP Synchronization</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Save Distributor
          </button>
        </form>
      </div>
    </div>
  );
}