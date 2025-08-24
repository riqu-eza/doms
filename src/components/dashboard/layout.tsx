"use client";
import React from "react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-blue-600 text-white p-4 flex justify-between">
        <h1 className="font-bold text-lg">Med Orders System</h1>
        <div className="flex gap-4">
          <Link href="/dashboard/vendor">Vendor</Link>
          <Link href="/dashboard/distributor">Distributor</Link>
        </div>
      </nav>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
