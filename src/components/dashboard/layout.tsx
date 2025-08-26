"use client";
import React from "react";
import Link from "next/link";
import { useUser } from "@/app/context/UserContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useUser();
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-teal-800 text-white flex flex-col">
        <div className="p-5 border-b border-teal-700">
          <h1 className="font-bold text-xl flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
              />
            </svg>
            Med Orders System
          </h1>
          {/* {user && (
            // <p className="text-teal-200 text-sm mt-1">
            //   Welcome, {user.name || user.email}
            // </p>
          )} */}
        </div>
        
        <nav className="flex-1 p-4">
          <div className="mb-6">
            <h2 className="text-teal-400 text-xs uppercase font-bold mb-3 tracking-wider">Navigation</h2>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/dashboard/vendor" 
                  className="flex items-center p-2 rounded-lg hover:bg-teal-700 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Vendor Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/distributor" 
                  className="flex items-center p-2 rounded-lg hover:bg-teal-700 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Distributor Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        
        <div className="p-4 border-t border-teal-700">
          <button
            onClick={logout}
            className="flex items-center w-full p-2 text-teal-200 rounded-lg hover:bg-teal-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}