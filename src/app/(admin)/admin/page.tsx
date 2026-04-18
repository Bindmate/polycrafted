"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCheckoutStore } from "@/lib/store";
import { supabase } from "@/lib/supabase"; // Adjust this path if your supabase client is located elsewhere
import { 
  TrendingUp, Clock, Package, AlertTriangle, ArrowRight, CheckCircle2, 
  Mail, Users, Send, CheckSquare
} from "lucide-react";

export default function AdminDashboard() {
  const { adminOrders, fetchAdminOrders, products, fetchProducts } = useCheckoutStore();

  // --- TAB STATE ---
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'OUTREACH'>('OVERVIEW');

  // --- OUTREACH STATES ---
  const [leads, setLeads] = useState<any[]>([]); 
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<'pitch' | 'followup' | 'promo'>('pitch');
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSendingEmails, setIsSendingEmails] = useState(false);

  // Fetch the latest data as soon as the dashboard loads
  useEffect(() => {
    fetchAdminOrders();
    fetchProducts();
    
    // Fetch Leads from Supabase
    const fetchLeads = async () => {
      const { data, error } = await supabase
        .from('Lead')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setLeads(data);
      }
    };

    fetchLeads();
  }, [fetchAdminOrders, fetchProducts]);

  // --- OUTREACH TEMPLATE EFFECT ---
  useEffect(() => {
    if (selectedTemplate === 'pitch') {
      setCustomSubject(`Polycrafted Partnership Inquiry — [Institution]`);
      setCustomBody(`Hi [Contact Person],

We noticed [Institution] has some upcoming events, and we'd love to help you source high-quality, custom-crafted items for your members or attendees.

At Polycrafted, we specialize in bulk orders with reliable turnaround times and premium quality.

Let us know if you have 5 minutes this week to chat!

Best,
The Polycrafted Team`);
    } else if (selectedTemplate === 'followup') {
      setCustomSubject(`Checking in — Polycrafted for [Institution]`);
      setCustomBody(`Hi [Contact Person],

Just floating this back to the top of your inbox. Let me know if [Institution] is still looking for custom merchandise or bulk items this semester.

Best,
The Polycrafted Team`);
    } else {
      setCustomSubject(`Exclusive Polycrafted Discount for [Institution] Members`);
      setCustomBody(`Hi [Contact Person],

We’ve generated a special code exclusively for [Institution]. Share this with your members for 15% off their next Polycrafted order!

Code: [Institution]-15

Best,
The Polycrafted Team`);
    }
  }, [selectedTemplate]);

  // --- DYNAMIC CALCULATIONS (OVERVIEW) ---
  const needsVerificationCount = adminOrders.filter(o => o.status === "Awaiting Verification").length;
  const toShipCount = adminOrders.filter(o => o.status === "Preparing to Ship").length;
  const totalSales = adminOrders
    .filter(o => o.status === "Preparing to Ship" || o.status === "Shipped")
    .reduce((sum, order) => sum + order.total, 0);
  const lowStockProducts = products.filter(p => p.stock <= 5);
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

  // --- OUTREACH ACTIONS ---
  const handleMassSend = async () => {
    if (selectedLeadIds.length === 0) return alert("Please select at least one organization.");
    
    const recipients = leads
      .filter(l => selectedLeadIds.includes(l.id.toString()) && l.contact_info)
      .map(l => ({ email: l.contact_info, name: l.org_name }));

    if (recipients.length === 0) return alert("No valid email addresses selected.");
    if (!window.confirm(`Ready to blast ${recipients.length} emails?`)) return;

    setIsSendingEmails(true);
    try {
      const res = await fetch('/api/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: recipients,
          subject: customSubject,
          messageTemplate: customBody,
          attachmentUrl: attachmentUrl,
          imageUrl: imageUrl 
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`🚀 Successfully sent ${data.sent} emails!`);
        setSelectedLeadIds([]);
      } else {
        alert("Error sending emails: " + data.message);
      }
    } catch (error) {
      alert("Network Error.");
    }
    setIsSendingEmails(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative pb-20">
      
      {/* HEADER & TAB NAVIGATION */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Command Center</h1>
        
        <div className="flex border-b border-gray-200 gap-8">
          <button 
            onClick={() => setActiveTab('OVERVIEW')} 
            className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all duration-300 ${activeTab === 'OVERVIEW' ? 'border-b-2 border-[#D4537E] text-[#D4537E]' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <TrendingUp className="w-4 h-4" /> Operations Overview
          </button>
          <button 
            onClick={() => setActiveTab('OUTREACH')} 
            className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all duration-300 ${activeTab === 'OUTREACH' ? 'border-b-2 border-[#D4537E] text-[#D4537E]' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Mail className="w-4 h-4" /> Email Outreach Hub
          </button>
        </div>
      </div>

      {/* ========================================= */}
      {/* TAB 1: OPERATIONS OVERVIEW                  */}
      {/* ========================================= */}
      {activeTab === 'OVERVIEW' && (
        <div className="animate-in fade-in duration-300">
          {/* TOP METRIC CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
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
                  <p className="text-xs text-gray-400">Remember to restock popular editions before the surge!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* TAB 2: OUTREACH HUB                         */}
      {/* ========================================= */}
      {activeTab === 'OUTREACH' && (
        <div className="animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Targets & Strategy */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Target Selector */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#D4537E]" /> Select Targets
                </h3>
                <button 
                  onClick={() => setSelectedLeadIds(selectedLeadIds.length === leads.length && leads.length > 0 ? [] : leads.map(l => l.id.toString()))} 
                  className="text-[10px] text-[#D4537E] font-bold uppercase hover:underline"
                >
                  {selectedLeadIds.length === leads.length && leads.length > 0 ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              
              <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                {leads.length === 0 ? (
                  <p className="text-xs text-gray-500 font-medium text-center py-4">No organizations added to database yet.</p>
                ) : (
                  leads.map(lead => (
                    <label key={lead.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200 shadow-sm">
                      <input 
                        type="checkbox" 
                        checked={selectedLeadIds.includes(lead.id.toString())} 
                        onChange={(e) => {
                          if (e.target.checked) setSelectedLeadIds([...selectedLeadIds, lead.id.toString()]);
                          else setSelectedLeadIds(selectedLeadIds.filter(id => id !== lead.id.toString()));
                        }} 
                        className="w-4 h-4 accent-[#D4537E] rounded" 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{lead.org_name}</p>
                        <p className="text-[9px] text-gray-500 truncate">{lead.contact_info || 'No Email Logged'}</p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Strategy Selector */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#D4537E]" /> Strategy Template
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'pitch', title: 'Cold Pitch', desc: 'Initial B2B partnership request.' },
                  { id: 'followup', title: 'The Follow-Up', desc: 'Reminder for unresponsive leads.' },
                  { id: 'promo', title: 'Promo Blast', desc: 'Send an exclusive Polycrafted code.' }
                ].map(tmpl => (
                  <label key={tmpl.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${selectedTemplate === tmpl.id ? 'bg-[#FBEAF0] border-[#D4537E]' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                    <input type="radio" name="template" value={tmpl.id} checked={selectedTemplate === tmpl.id} onChange={() => setSelectedTemplate(tmpl.id as any)} className="w-4 h-4 accent-[#D4537E]" />
                    <div>
                      <p className="text-xs font-bold text-gray-800">{tmpl.title}</p>
                      <p className="text-[10px] text-gray-500 font-medium">{tmpl.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Composer & Blast */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full min-h-[500px]">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Send className="w-4 h-4 text-[#D4537E]" /> Composer & Output
            </h3>
            
            <div className="mb-4">
              <div className="flex justify-between items-end mb-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Subject Line</label>
                <span className="text-[8px] font-bold text-[#D4537E] bg-[#FBEAF0] px-2 py-0.5 rounded">Leaves [Institution] to auto-inject names</span>
              </div>
              <input 
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm font-bold text-gray-800 shadow-sm outline-none focus:border-[#D4537E] transition-colors" 
              />
            </div>

            <div className="flex-1 flex flex-col mb-4">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Email Body</label>
              <textarea 
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                className="w-full flex-1 bg-white border border-gray-200 rounded-xl p-6 text-sm font-medium text-gray-700 shadow-sm outline-none focus:border-[#D4537E] resize-none min-h-[250px] transition-colors"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-1">PDF Attachment (URL)</label>
                <input 
                  type="url" 
                  placeholder="e.g. https://supabase.co/proposal.pdf"
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-medium text-gray-800 outline-none focus:border-[#D4537E] shadow-sm"
                />
              </div>

              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-1">Inline Image Banner (URL)</label>
                <input 
                  type="url" 
                  placeholder="e.g. https://supabase.co/banner.png"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-medium text-gray-800 outline-none focus:border-[#D4537E] shadow-sm"
                />
              </div>
            </div>

            <button 
              onClick={handleMassSend}
              disabled={isSendingEmails || selectedLeadIds.length === 0}
              className={`mt-6 w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md transition-all flex justify-center items-center gap-2 ${selectedLeadIds.length > 0 ? 'bg-[#D4537E] hover:bg-[#b04065] text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              {isSendingEmails ? (
                 <><span className="animate-spin">⏳</span> Sending to {selectedLeadIds.length} partners...</>
              ) : (
                 <><Send className="w-4 h-4" /> Blast Emails to {selectedLeadIds.length} Partners</>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}