"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useCheckoutStore } from "@/lib/store";
import { TrendingUp, Clock, Package, AlertTriangle, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const { adminOrders, fetchAdminOrders, products, fetchProducts } = useCheckoutStore();

  // Fetch the latest data as soon as the dashboard loads
  useEffect(() => {
    fetchAdminOrders();
    fetchProducts();
  }, [fetchAdminOrders, fetchProducts]);

  // --- DYNAMIC CALCULATIONS ---
  const needsVerificationCount = adminOrders.filter(o => o.status === "Awaiting Verification").length;
  
  // Count anything preparing to ship (we can ignore pickups if you want, but we'll count all for now)
  const toShipCount = adminOrders.filter(o => o.status === "Preparing to Ship").length;

  // Total Sales: Sum of all verified orders (Preparing to Ship + Shipped)
  const totalSales = adminOrders
    .filter(o => o.status === "Preparing to Ship" || o.status === "Shipped")
    .reduce((sum, order) => sum + order.total, 0);

  // Low Stock Items (5 or fewer)
  const lowStockProducts = products.filter(p => p.stock <= 5);
  
  // Get top 4 most recent orders
  const recentOrders = adminOrders.slice(0, 4);

  // Helper for Order Badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Awaiting Verification":
        return <span className="bg-[#fdf8f5] text-[#D4537E] border border-[#f0e8e0] px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Awaiting Verification</span>;
      case "Preparing to Ship":
        return <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Preparing to Ship</span>;
      case "Shipped":
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Shipped</span>;
      default:
        return <span className="bg-gray-50 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* TOP METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        
        {/* Total Sales */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
              +14% <TrendingUp className="w-3 h-3" />
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Sales (Verified)</p>
            <h3 className="text-2xl font-bold text-gray-900">₱{totalSales.toFixed(2)}</h3>
          </div>
        </div>

        {/* Needs Verification */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          {needsVerificationCount > 0 && <div className="absolute right-0 top-0 bottom-0 w-2 bg-[#D4537E]"></div>}
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-[#FBEAF0] flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#D4537E]" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Needs Verification</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {needsVerificationCount} <span className="text-sm font-medium text-gray-400 ml-1">Orders</span>
            </h3>
          </div>
        </div>

        {/* To Ship */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">To Ship / Prepare</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {toShipCount} <span className="text-sm font-medium text-gray-400 ml-1">Parcels</span>
            </h3>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Low Stock Alerts</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {lowStockProducts.length} <span className="text-sm font-medium text-gray-400 ml-1">Designs</span>
            </h3>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTIONS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* RECENT ORDERS TABLE */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-lg">Action Required: Recent Orders</h3>
            <Link href="/admin/orders" className="text-sm font-medium text-[#D4537E] hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No orders to display yet.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.db_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-700">{order.customer.name}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">₱{order.total.toFixed(2)}</td>
                      <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* INVENTORY ALERTS */}
        <div className="xl:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg">Inventory Alerts</h3>
          </div>
          
          <div className="p-6 flex-1 flex flex-col gap-4">
            {lowStockProducts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-200 mb-3" />
                <p className="text-sm font-medium text-gray-900">Stock levels are healthy!</p>
                <p className="text-xs text-gray-500 mt-1">No designs currently require a restock.</p>
              </div>
            ) : (
              lowStockProducts.map(product => (
                <div key={product.id} className="bg-[#fdf8f5] border border-[#f0e8e0] rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-[#2C2C2A] text-sm mb-0.5 leading-tight">{product.name}</p>
                    <p className="text-xs font-bold text-red-500">Only {product.stock} left in stock!</p>
                  </div>
                  <Link 
                    href="/admin/inventory" 
                    className="flex-shrink-0 bg-white border border-[#D4537E]/20 text-[#D4537E] text-xs font-bold px-4 py-2 rounded-full hover:bg-[#FBEAF0] transition-colors"
                  >
                    Restock
                  </Link>
                </div>
              ))
            )}

            <div className="mt-auto pt-4 text-center">
              <p className="text-xs text-gray-400">Remember to restock popular college editions before the midterms surge!</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

// Just a quick icon helper for the empty state
import { CheckCircle2 } from "lucide-react";