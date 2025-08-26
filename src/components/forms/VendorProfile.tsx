/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";

export default function VendorProfile({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: string, text: string} | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/vendor?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      } else {
        // Initialize empty profile if none exists
        setProfile({
          name: "",
          type: "",
          accountStatus: "ACTIVE",
          pricingTier: "",
          notes: "",
          billingAddress: {
            line1: "",
            city: "",
            country: "",
            postalCode: ""
          },
          shippingAddress: {
            line1: "",
            city: "",
            country: "",
            postalCode: ""
          }
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setMessage({ type: "error", text: "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (type: "billingAddress" | "shippingAddress", field: string, value: string) => {
    setProfile({
      ...profile,
      [type]: { 
        ...profile?.[type], 
        [field]: value 
      },
    });
  };

  const copyBillingToShipping = () => {
    setProfile({
      ...profile,
      shippingAddress: { ...profile.billingAddress }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    try {
      const res = await fetch("/api/vendor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, userId }),
      });
      
      if (res.ok) {
        setMessage({ type: "success", text: "Profile saved successfully!" });
        // Refresh data to get any server-generated fields
        await fetchProfile();
      } else {
        const err = await res.json();
        setMessage({ type: "error", text: "Error: " + err.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-12 bg-gray-200 rounded w-32 mt-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-2xl text-gray-800">Vendor Profile</h3>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${profile?.accountStatus === "ACTIVE" ? "bg-green-500" : "bg-amber-500"}`}></div>
          <span className="text-sm font-medium text-gray-600">
            {profile?.accountStatus || "UNKNOWN"}
          </span>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h4 className="font-semibold text-lg text-gray-700 mb-4 pb-2 border-b border-gray-200">Basic Information</h4>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name *</label>
            <input
              name="name"
              value={profile?.name || ""}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter vendor name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
            <select
              name="type"
              value={profile?.type || ""}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Select Business Type</option>
              <option value="PHARMACY">Pharmacy</option>
              <option value="CLINIC">Clinic</option>
              <option value="HOSPITAL">Hospital</option>
              <option value="WHOLESALER">Wholesaler</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
            <select
              name="accountStatus"
              value={profile?.accountStatus || "ACTIVE"}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Tier</label>
            <input
              name="pricingTier"
              value={profile?.pricingTier || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g., Standard, Premium"
            />
          </div>

          {/* Billing Address */}
          <div className="md:col-span-2 mt-4">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
              <h4 className="font-semibold text-lg text-gray-700">Billing Address</h4>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
            <input
              value={profile?.billingAddress?.line1 || ""}
              onChange={(e) => handleAddressChange("billingAddress", "line1", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Street address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              value={profile?.billingAddress?.city || ""}
              onChange={(e) => handleAddressChange("billingAddress", "city", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="City"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
            <input
              value={profile?.billingAddress?.postalCode || ""}
              onChange={(e) => handleAddressChange("billingAddress", "postalCode", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Postal code"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              value={profile?.billingAddress?.country || ""}
              onChange={(e) => handleAddressChange("billingAddress", "country", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Country"
            />
          </div>

          {/* Shipping Address */}
          <div className="md:col-span-2 mt-4">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
              <h4 className="font-semibold text-lg text-gray-700">Shipping Address</h4>
              <button 
                type="button"
                onClick={copyBillingToShipping}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy from Billing
              </button>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
            <input
              value={profile?.shippingAddress?.line1 || ""}
              onChange={(e) => handleAddressChange("shippingAddress", "line1", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Street address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              value={profile?.shippingAddress?.city || ""}
              onChange={(e) => handleAddressChange("shippingAddress", "city", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="City"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
            <input
              value={profile?.shippingAddress?.postalCode || ""}
              onChange={(e) => handleAddressChange("shippingAddress", "postalCode", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Postal code"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              value={profile?.shippingAddress?.country || ""}
              onChange={(e) => handleAddressChange("shippingAddress", "country", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Country"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={profile?.notes || ""}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Additional notes about this vendor..."
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={fetchProfile}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}