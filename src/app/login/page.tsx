"use client";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // important
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);

      const role = data.user?.role;

      switch (role) {
        case "VENDOR_ADMIN":
          window.location.href = "/vendor/dashboard";
          break;

        case "VENDOR_USER":
          window.location.href = "/vendor/user-dashboard";
          break;

        case "DISTRIBUTOR_ADMIN":
          window.location.href = "/distributor/dashboard";
          break;

        case "DISTRIBUTOR_MANAGER":
          window.location.href = "/distributor/manager-dashboard";
          break;

        case "DISTRIBUTOR_AGENT":
          window.location.href = "/distributor/agent-dashboard";
          break;

        default:
          window.location.href = "/";
      }
    } else {
      alert(data.error || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-sm mx-auto">
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="border p-2 w-full"
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="border p-2 w-full"
      />
      <button
        type="submit"
        className="bg-green-600 text-white p-2 rounded w-full"
      >
        Login
      </button>
      <p className="text-center text-sm text-gray-600">
        Don&#39;t have an account?{" "}
        <a href="/signup" className="text-blue-600">
          Sign up
        </a>
      </p>
    </form>
  );
}
