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
    <form onSubmit={handleSubmit} className="p-4 space-y-3 border rounded-lg shadow">
      <h2 className="text-xl font-bold">Add Distributor Organization</h2>

      <input
        type="text"
        name="name"
        placeholder="Organization Name"
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <input
        type="email"
        name="contactEmail"
        placeholder="Contact Email"
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        name="contactPhone"
        placeholder="Contact Phone"
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <h3 className="font-semibold">Address</h3>
      <input
        type="text"
        name="address.line1"
        placeholder="Address Line 1"
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="address.city"
        placeholder="City"
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="address.country"
        placeholder="Country"
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="address.postalCode"
        placeholder="Postal Code"
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <h3 className="font-semibold">Settings</h3>
      <input
        type="text"
        name="settings.currency"
        placeholder="Currency (e.g., USD)"
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="settings.timezone"
        placeholder="Timezone (e.g., Africa/Nairobi)"
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="settings.invoicePrefix"
        placeholder="Invoice Prefix (e.g., INV-)"
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="settings.features.chat"
          onChange={handleChange}
        />
        <span>Enable Chat</span>
      </label>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="settings.features.invoicing"
          onChange={handleChange}
        />
        <span>Enable Invoicing</span>
      </label>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="settings.features.erpSync"
          onChange={handleChange}
        />
        <span>Enable ERP Sync</span>
      </label>

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded"
      >
        Save Distributor
      </button>
    </form>
  );
}
