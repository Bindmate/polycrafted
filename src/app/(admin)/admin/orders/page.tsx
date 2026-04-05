"use client";
import { useState } from "react";
import { 
  Search, Filter, Eye, CheckCircle2, XCircle, 
  Package, Truck, Clock, X, ScanText, AlertTriangle, Check, ExternalLink
} from "lucide-react";

// MOCK DATA: Upgraded to include AI-parsed receipt data!
const INITIAL_ORDERS = [
  {
    id: "ORD-0042",
    date: "Apr 5, 2026",
    customer: {
      name: "Maria Clara",
      phone: "0912-345-6789",
      address: "Unit 4B, Sampaguita St, Quezon City",
      school: "PUP Manila • COC • Freshman"
    },
    items: [
      { name: "College of Communication edition", qty: 2, price: 48.00 },
      { name: "PUP Pylon original sticker", qty: 1, price: 48.00 }
    ],
    total: 144.00,
    payment: {
      method: "GCash",
      downpaymentExpected: 72.00,
      parsedByAI: true,
      extractedAmount: 72.00,
      referenceNo: "8091 2345 6789 123",
      proofImage: "https://images.unsplash.com/photo-1621360841013-c76831f13b63?q=80&w=400&auto=format&fit=crop"
    },
    status: "Awaiting Verification"
  },
  {
    id: "ORD-0041",
    date: "Apr 4, 2026",
    customer: {
      name: "Juan Luna",
      phone: "0998-765-4321",
      address: "12 Rizal Ave, Manila",
      school: "PUP Manila • CCIS • Sophomore"
    },
    items: [
      { name: "Cyberpunk Manila Beep Sticker", qty: 1, price: 150.00 }
    ],
    total: 150.00,
    payment: {
      method: "Maya",
      downpaymentExpected: 75.00,
      parsedByAI: true,
      extractedAmount: 50.00, // Uh oh, they underpaid!
      referenceNo: "9002 8888 1111 000",
      proofImage: "https://images.unsplash.com/photo-1621360841013-c76831f13b63?q=80&w=400&auto=format&fit=crop"
    },
    status: "Awaiting Verification"
  },
  {
    id: "ORD-0040",
    date: "Apr 3, 2026",
    customer: {
      name: "Jose Rizal",
      phone: "0917-123-4567",
      address: "Calamba, Laguna",
      school: "UST • Medicine • Senior"
    },
    items: [
      { name: "Kuromi Iska ID Badge", qty: 2, price: 48.00 },
      { name: "Coquette Cream 1", qty: 2, price: 24.00 }
    ],
    total: 144.00,
    payment: {
      method: "GCash",
      downpaymentExpected: 72.00,
      parsedByAI: true,
      extractedAmount: 72.00,
      referenceNo: "1111 2222 3333 444",
      proofImage: "verified" 
    },
    status: "Preparing to Ship"
  }
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    if (activeTab === "All") return true;
    return order.status === activeTab;
  });

  // Action: Approve Payment
  const handleApprove = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: "Preparing to Ship" } : o
    ));
    setSelectedOrder(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Awaiting Verification":
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> Verification</span>;
      case "Preparing to Ship":
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><Package className="w-3 h-3" /> Preparing</span>;
      case "Shipped":
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><Truck className="w-3 h-3" /> Shipped</span>;
      default:
        return null;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
          {["All", "Awaiting Verification", "Preparing to Ship", "Shipped"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab ? "bg-[#FBEAF0] text-[#D4537E]" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab === "All" ? "All Orders" : tab}
            </button>
          ))}
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search Order ID or Name..." className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#D4537E] focus:ring-1 focus:ring-[#D4537E]" />
          </div>
          <button className="bg-white border border-gray-200 p-2 rounded-xl text-gray-600 hover:bg-gray-50 shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No orders found for this status.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{order.customer.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">{order.customer.school}</p>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">₱{order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#D4537E] bg-[#FBEAF0]/50 hover:bg-[#FBEAF0] px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" /> Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- FULL-SCREEN CENTERED MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
          
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[24px] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden border border-gray-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-gray-50">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">{selectedOrder.id}</h2>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <p className="text-sm text-gray-500 mt-1">Placed on {selectedOrder.date}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Split Layout) */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* LEFT COLUMN: Order Details */}
                <div className="space-y-8">
                  {/* Customer Block */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 border-b border-gray-100 pb-2">Customer Details</h3>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Name</p>
                        <p className="font-medium text-gray-900">{selectedOrder.customer.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Phone</p>
                        <p className="font-medium text-gray-900">{selectedOrder.customer.phone}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500 text-xs mb-1">Demographic</p>
                        <p className="font-medium text-[#D4537E] bg-[#FBEAF0] px-2 py-1 rounded-md w-fit mt-1">{selectedOrder.customer.school}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500 text-xs mb-1">Delivery Address</p>
                        <p className="font-medium text-gray-900">{selectedOrder.customer.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items Block */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 border-b border-gray-100 pb-2">Order Items</h3>
                    <ul className="space-y-3 mb-4">
                      {selectedOrder.items.map((item: any, idx: number) => (
                        <li key={idx} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-3">
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">{item.qty}x</span>
                            <span className="text-gray-900 font-medium">{item.name}</span>
                          </div>
                          <span className="text-gray-600">₱{(item.price * item.qty).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                      <div>
                        <span className="font-medium text-gray-500 text-sm block">Total Value</span>
                      </div>
                      <span className="font-bold text-2xl text-gray-900">₱{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: AI Payment Verification */}
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200 h-fit">
                  <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-4">
                    <ScanText className="w-5 h-5 text-[#D4537E]" />
                    <h3 className="font-bold text-gray-900">AI Receipt Analysis</h3>
                  </div>

                  {selectedOrder.status === "Awaiting Verification" ? (
                    <div className="space-y-6">
                      
                      {/* Expected vs Actual Math */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                          <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">Expected Downpayment</p>
                          <p className="text-xl font-bold text-gray-900">₱{selectedOrder.payment.downpaymentExpected.toFixed(2)}</p>
                        </div>
                        
                        <div className={`p-4 rounded-xl border shadow-sm ${
                          selectedOrder.payment.extractedAmount >= selectedOrder.payment.downpaymentExpected 
                            ? "bg-emerald-50 border-emerald-200" 
                            : "bg-red-50 border-red-200"
                        }`}>
                          <p className="text-xs font-medium mb-1 uppercase tracking-wider flex items-center justify-between">
                            <span className={selectedOrder.payment.extractedAmount >= selectedOrder.payment.downpaymentExpected ? "text-emerald-700" : "text-red-700"}>
                              Extracted Amount
                            </span>
                            {selectedOrder.payment.extractedAmount >= selectedOrder.payment.downpaymentExpected ? (
                               <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                               <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                            )}
                          </p>
                          <p className={`text-xl font-bold ${
                            selectedOrder.payment.extractedAmount >= selectedOrder.payment.downpaymentExpected 
                              ? "text-emerald-800" 
                              : "text-red-800"
                          }`}>
                            ₱{selectedOrder.payment.extractedAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* AI Verification Flags */}
                      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
                        <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                          <span className="text-gray-500">Payment Method</span>
                          <span className="font-bold text-gray-900">{selectedOrder.payment.method}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                          <span className="text-gray-500">Reference Number</span>
                          <span className="font-mono font-medium text-gray-900 tracking-wider bg-gray-100 px-2 py-1 rounded">{selectedOrder.payment.referenceNo}</span>
                        </div>
                        
                        {/* Auto-Match Indicator */}
                        {selectedOrder.payment.extractedAmount >= selectedOrder.payment.downpaymentExpected ? (
                          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-lg text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            Amount matches or exceeds required 50% downpayment.
                          </div>
                        ) : (
                          <div className="flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium">
                            <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            Warning: Extracted amount is less than the required downpayment. Please contact customer.
                          </div>
                        )}

                        {/* NEW: Button to view the raw image in a new tab */}
                        {selectedOrder.payment.proofImage && selectedOrder.payment.proofImage !== "verified" && (
                          <a 
                            href={selectedOrder.payment.proofImage} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full mt-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm font-medium hover:bg-gray-100 hover:border-gray-300 transition-all"
                          >
                            <ExternalLink className="w-4 h-4" /> View Original Receipt
                          </a>
                        )}

                      </div>
                    </div>
                  ) : (
                    // Display if already Verified/Preparing
                    <div className="bg-white border border-emerald-200 rounded-xl p-8 text-center shadow-sm">
                      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h3 className="text-lg font-bold text-emerald-900 mb-1">Payment Verified</h3>
                      <p className="text-sm text-emerald-700">Ref: {selectedOrder.payment.referenceNo}</p>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Modal Footer Actions */}
            {selectedOrder.status === "Awaiting Verification" && (
              <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-4">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2.5 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors text-sm"
                >
                  <XCircle className="w-4 h-4" /> Reject Payment
                </button>
                <button 
                  onClick={() => handleApprove(selectedOrder.id)}
                  disabled={selectedOrder.payment.extractedAmount < selectedOrder.payment.downpaymentExpected}
                  className={`flex items-center gap-2 px-8 py-2.5 rounded-full font-medium shadow-sm transition-colors text-sm ${
                    selectedOrder.payment.extractedAmount >= selectedOrder.payment.downpaymentExpected
                      ? "bg-[#D4537E] text-white hover:bg-[#b8436b]"
                      : "bg-gray-300 text-white cursor-not-allowed"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" /> 
                  {selectedOrder.payment.extractedAmount >= selectedOrder.payment.downpaymentExpected ? "Verify & Process Order" : "Verification Blocked"}
                </button>
              </div>
            )}
            
             {selectedOrder.status === "Preparing to Ship" && (
               <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-4">
                <button 
                  className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-[#2C2C2A] text-white font-medium hover:bg-black shadow-sm transition-colors text-sm"
                >
                  <Truck className="w-4 h-4" /> Mark as Shipped
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}