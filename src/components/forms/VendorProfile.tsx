/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";

export default function VendorProfile({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`/api/vendor?userId=${userId}`);
      const data = await res.json();
      setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (type: "billingAddress" | "shippingAddress", field: string, value: string) => {
    setProfile({
      ...profile,
      [type]: { ...profile?.[type], [field]: value },
    });
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/vendor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...profile, userId }),
    });
    if (res.ok) {
      alert("Profile saved successfully!");
    } else {
      const err = await res.json();
      alert("Error: " + err.error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="font-bold text-lg mb-2">Vendor Profile</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          value={profile?.name || ""}
          onChange={handleChange}
          placeholder="Vendor Name"
          className="border p-2 rounded"
        />
        <select
          name="type"
          value={profile?.type || ""}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Select Type</option>
          <option value="PHARMACY">Pharmacy</option>
          <option value="CLINIC">Clinic</option>
          <option value="HOSPITAL">Hospital</option>
          <option value="WHOLESALER">Wholesaler</option>
        </select>

        {/* Billing Address */}
        <input
          value={profile?.billingAddress?.line1 || ""}
          onChange={(e) => handleAddressChange("billingAddress", "line1", e.target.value)}
          placeholder="Billing Address Line 1"
          className="border p-2 rounded"
        />
        <input
          value={profile?.billingAddress?.city || ""}
          onChange={(e) => handleAddressChange("billingAddress", "city", e.target.value)}
          placeholder="Billing City"
          className="border p-2 rounded"
        />
        <input
          value={profile?.billingAddress?.country || ""}
          onChange={(e) => handleAddressChange("billingAddress", "country", e.target.value)}
          placeholder="Billing Country"
          className="border p-2 rounded"
        />
        <input
          value={profile?.billingAddress?.postalCode || ""}
          onChange={(e) => handleAddressChange("billingAddress", "postalCode", e.target.value)}
          placeholder="Billing Postal Code"
          className="border p-2 rounded"
        />

        {/* Shipping Address */}
        <input
          value={profile?.shippingAddress?.line1 || ""}
          onChange={(e) => handleAddressChange("shippingAddress", "line1", e.target.value)}
          placeholder="Shipping Address Line 1"
          className="border p-2 rounded"
        />
        <input
          value={profile?.shippingAddress?.city || ""}
          onChange={(e) => handleAddressChange("shippingAddress", "city", e.target.value)}
          placeholder="Shipping City"
          className="border p-2 rounded"
        />
        <input
          value={profile?.shippingAddress?.country || ""}
          onChange={(e) => handleAddressChange("shippingAddress", "country", e.target.value)}
          placeholder="Shipping Country"
          className="border p-2 rounded"
        />
        <input
          value={profile?.shippingAddress?.postalCode || ""}
          onChange={(e) => handleAddressChange("shippingAddress", "postalCode", e.target.value)}
          placeholder="Shipping Postal Code"
          className="border p-2 rounded"
        />

        {/* Extra fields */}
        <select
          name="accountStatus"
          value={profile?.accountStatus || "ACTIVE"}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="ACTIVE">Active</option>
          <option value="ON_HOLD">On Hold</option>
        </select>
        <input
          name="pricingTier"
          value={profile?.pricingTier || ""}
          onChange={handleChange}
          placeholder="Pricing Tier"
          className="border p-2 rounded"
        />
        <textarea
          name="notes"
          value={profile?.notes || ""}
          onChange={handleChange}
          placeholder="Notes"
          className="border p-2 rounded col-span-2"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Profile
      </button>
    </div>
  );
}
