"use client";
import { ArrowUpRight, Clock, PackageCheck, TrendingUp, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      
      {/* 1. TOP METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
              +14% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Total Sales (This Week)</p>
          <h3 className="text-2xl font-bold text-gray-900">₱4,250.00</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#D4537E]/20 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-[#D4537E]"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-[#FBEAF0] text-[#D4537E] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Needs Verification</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900">3</h3>
            <p className="text-sm text-gray-500">Orders</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">To Ship (Lalamove/J&T)</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900">12</h3>
            <p className="text-sm text-gray-500">Parcels</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Low Stock Alerts</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900">2</h3>
            <p className="text-sm text-gray-500">Designs</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. RECENT ORDERS TABLE */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">Action Required: Recent Orders</h2>
            <button className="text-sm text-[#D4537E] font-medium hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { id: "ORD-0042", name: "Maria Clara", amt: "₱144.00", status: "Awaiting Verification", color: "bg-amber-100 text-amber-800" },
                  { id: "ORD-0041", name: "Juan Luna", amt: "₱48.00", status: "Awaiting Verification", color: "bg-amber-100 text-amber-800" },
                  { id: "ORD-0040", name: "Jose Rizal", amt: "₱320.00", status: "Preparing to Ship", color: "bg-blue-100 text-blue-800" },
                ].map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{row.id}</td>
                    <td className="px-6 py-4 text-gray-600">{row.name}</td>
                    <td className="px-6 py-4 text-gray-900">{row.amt}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${row.color}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. INVENTORY ALERTS */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Inventory Alerts</h2>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between p-3 rounded-xl border border-red-100 bg-red-50">
              <div>
                <p className="text-sm font-medium text-gray-900">PUP Pylon Original</p>
                <p className="text-xs text-red-600 font-medium">Only 3 left in stock!</p>
              </div>
              <button className="text-xs bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50">Restock</button>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-xl border border-red-100 bg-red-50">
              <div>
                <p className="text-sm font-medium text-gray-900">Kuromi Iska Badge</p>
                <p className="text-xs text-red-600 font-medium">Only 4 left in stock!</p>
              </div>
              <button className="text-xs bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50">Restock</button>
            </div>

            <div className="mt-auto pt-4 text-center">
               <p className="text-xs text-gray-400">Remember to restock popular college editions before the midterms surge!</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}