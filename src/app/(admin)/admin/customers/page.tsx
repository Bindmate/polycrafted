"use client";
import { useState, useEffect } from "react";
// Using a direct relative path to fix the "Cannot find module" glitch in VS Code
import { useCheckoutStore, Order } from "../../../../lib/store"; 
import { Search, Filter, Users, GraduationCap, Phone, MapPin, Award } from "lucide-react";

export default function CustomersPage() {
  const { adminOrders, fetchAdminOrders } = useCheckoutStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAdminOrders();
  }, [fetchAdminOrders]);

  // Aggregate orders by customer name to create a unique customer list
  const getCustomersList = () => {
    const customersMap = new Map();

    // FIXED: Explicitly typing (order: Order) kills the implicit 'any' error!
    adminOrders.forEach((order: Order) => {
      // Use name as the unique identifier
      const key = order.customer.name.toLowerCase().trim();
      
      if (!customersMap.has(key)) {
        customersMap.set(key, {
          name: order.customer.name,
          phone: order.customer.phone,
          school: order.customer.school,
          address: order.customer.address,
          totalSpent: 0,
          orderCount: 0,
          lastOrderDate: order.date
        });
      }

      const c = customersMap.get(key);
      c.totalSpent += order.total;
      c.orderCount += 1;
      
      // Update last order date if this order is newer
      if (new Date(order.date) > new Date(c.lastOrderDate)) {
        c.lastOrderDate = order.date;
      }
    });

    return Array.from(customersMap.values());
  };

  const allCustomers = getCustomersList();
  
  // Apply Search Filter
  const filteredCustomers = allCustomers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort by Total Spent (Highest first) to find your top buyers
  filteredCustomers.sort((a, b) => b.totalSpent - a.totalSpent);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium mb-1">Total Unique Customers</p>
            <h3 className="text-2xl font-bold text-gray-900">{allCustomers.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-[#FBEAF0]/50 p-6 rounded-2xl border border-[#D4537E]/20 shadow-sm flex flex-col justify-center">
          <h3 className="text-[#D4537E] font-bold flex items-center gap-2 mb-1">
            <Award className="w-4 h-4" /> Top Iskolar Dynamics
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            This list is dynamically generated from your active Supabase orders. Customers are ranked by their lifetime spending.
          </p>
        </div>
      </div>

      {/* HEADER & CONTROLS */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Customer Directory</h2>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or school..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#D4537E] focus:ring-1 focus:ring-[#D4537E]" 
            />
          </div>
          <button className="bg-white border border-gray-200 p-2 rounded-xl text-gray-600 hover:bg-gray-50 shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* CUSTOMERS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Demographic</th>
                <th className="px-6 py-4 text-center">Total Orders</th>
                <th className="px-6 py-4 text-right">Lifetime Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No customers found. Wait for orders to roll in!</td>
                </tr>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 mb-1">{customer.name}</p>
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-xs text-gray-500"><Phone className="w-3 h-3"/> {customer.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 bg-[#fdf8f5] border border-[#f0e8e0] text-[#D4537E] px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase">
                        <GraduationCap className="w-3 h-3" /> {customer.school}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-full text-xs">
                        {customer.orderCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-black text-emerald-700 text-base">₱{customer.totalSpent.toFixed(2)}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Last active: {customer.lastOrderDate}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}