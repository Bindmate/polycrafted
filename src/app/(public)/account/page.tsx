"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCheckoutStore, Order } from "@/lib/store";
import { User, Heart, Sparkles, LogOut, TicketPercent, ArrowRight, Building, GraduationCap, CheckCircle2, ChevronRight, ShoppingBag, Trash2, Clock, Package, Truck, Box, X, Store, MapPin } from "lucide-react";

export default function AccountPage() {
  const { user, login, logout, wishlist, toggleWishlist, products, fetchProducts, items, myOrders, fetchMyOrders } = useCheckoutStore();
  
  useEffect(() => {
    if (products.length === 0) fetchProducts();
    if (user) fetchMyOrders(); 
  }, [products.length, fetchProducts, user, fetchMyOrders]);

  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [school, setSchool] = useState("");
  const [college, setCollege] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  
  // NEW: State for the Order Tracker Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleMockAuth = (e: React.FormEvent) => {
    e.preventDefault();
    login({ 
      name: isLogin ? "Jhon Luke" : firstName || "Iskolar", 
      email: email || "student@email.com", 
      school: isLogin ? "PUP Manila" : school || "PUP Manila",
      college: isLogin ? "Marketing" : college || "CBA",
      yearLevel: isLogin ? "Sophomore" : yearLevel || "Sophomore",
      isMember: true 
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Awaiting Verification":
        return <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider w-fit"><Clock className="w-3 h-3" /> Verification</span>;
      case "Preparing to Ship":
        return <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider w-fit"><Package className="w-3 h-3" /> Preparing</span>;
      case "Shipped":
        return <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider w-fit"><Truck className="w-3 h-3" /> Ready / Shipped</span>;
      default:
        return <span className="bg-gray-50 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider w-fit">{status}</span>;
    }
  };

  // Helper for the visual tracker timeline
  const getStepStatus = (orderStatus: string, stepName: string) => {
    const statuses = ["Awaiting Verification", "Preparing to Ship", "Shipped"];
    const currentIndex = statuses.indexOf(orderStatus);
    const stepIndex = statuses.indexOf(stepName);
    
    if (currentIndex >= stepIndex) return true; // Completed or Active
    return false; // Pending
  };

  // --- GUEST STATE ---
  if (!user) {
    return (
      <div className="min-h-screen bg-[#fdf8f5] text-gray-800 font-sans pb-24 relative overflow-x-hidden">
        <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#f0e8e0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
            <Link href="/" className="text-xl md:text-2xl font-medium tracking-tight flex-shrink-0">
              pup<span className="text-[#D4537E]">merch</span>
            </Link>
            <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
              <Link href="/catalog" className="hidden sm:block text-sm font-medium text-gray-600 hover:text-[#D4537E] mr-4 transition-colors">
                Catalog
              </Link>
              <Link href="/catalog" className="flex items-center gap-2 bg-[#2C2C2A] text-white px-3.5 py-2 md:px-5 md:py-3 rounded-full text-sm font-medium hover:bg-black transition-colors">
                <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden xs:inline">My bag</span>
                {cartItemCount > 0 && <span className="bg-white text-[#2C2C2A] text-xs font-semibold px-2 py-0.5 rounded-full ml-0.5 md:ml-1">{cartItemCount}</span>}
              </Link>
            </div>
          </div>
        </nav>

        <div className="flex items-center justify-center p-4 py-10 md:py-20">
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white border border-[#f0e8e0] rounded-[24px] md:rounded-[32px] shadow-xl overflow-hidden">
            
            <div className="bg-[#FBEAF0] p-8 md:p-10 flex flex-col justify-center order-2 md:order-1 border-t md:border-t-0 md:border-r border-[#f0e8e0]/50">
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-[#D4537E] mb-4 md:mb-6" />
              <h2 className="text-2xl md:text-3xl font-medium text-[#2C2C2A] mb-3 md:mb-4 tracking-tight">Join the Community</h2>
              <p className="text-[#72243E]/80 text-xs md:text-sm mb-6 md:mb-8 leading-relaxed">
                Create an account to unlock exclusive perks tailored for your college journey.
              </p>
              <ul className="space-y-3 md:space-y-4">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#D4537E] flex-shrink-0 mt-0.5" /><span className="text-xs md:text-sm font-medium text-[#2C2C2A]">Permanent 10% OFF all orders</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#D4537E] flex-shrink-0 mt-0.5" /><span className="text-xs md:text-sm font-medium text-[#2C2C2A]">Save items to your Wishlist</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#D4537E] flex-shrink-0 mt-0.5" /><span className="text-xs md:text-sm font-medium text-[#2C2C2A]">Early access to your college's drops</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#D4537E] flex-shrink-0 mt-0.5" /><span className="text-xs md:text-sm font-medium text-[#2C2C2A]">Personalized promos and updates</span></li>
              </ul>
            </div>

            <div className="p-8 md:p-10 flex flex-col justify-center order-1 md:order-2">
              <h1 className="text-xl md:text-2xl font-medium text-[#2C2C2A] mb-6">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
              <form onSubmit={handleMockAuth} className="space-y-4">
                {!isLogin && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
                    <div>
                      <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Nickname</label>
                      <input required type="text" placeholder="How should we call you?" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] outline-none rounded-2xl py-2.5 md:py-3 px-4 text-xs md:text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">School / University</label>
                      <div className="relative">
                        <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input required type="text" placeholder="e.g. PUP Manila" value={school} onChange={(e) => setSchool(e.target.value)} className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] outline-none rounded-2xl py-2.5 md:py-3 pl-10 pr-4 text-xs md:text-sm transition-all" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">College/Dept</label>
                        <input required type="text" placeholder="e.g. CCIS" value={college} onChange={(e) => setCollege(e.target.value)} className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] outline-none rounded-2xl py-2.5 md:py-3 px-4 text-xs md:text-sm transition-all" />
                      </div>
                      <div>
                        <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Year Level</label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select required value={yearLevel} onChange={(e) => setYearLevel(e.target.value)} className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] outline-none rounded-2xl py-2.5 md:py-3 pl-9 pr-4 text-xs md:text-sm transition-all appearance-none cursor-pointer">
                            <option value="" disabled>Select...</option>
                            <option value="Freshman">Freshman</option>
                            <option value="Sophomore">Sophomore</option>
                            <option value="Junior">Junior</option>
                            <option value="Senior">Senior</option>
                            <option value="Alumni">Alumni</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Email</label>
                  <input required type="email" placeholder="student@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] outline-none rounded-2xl py-2.5 md:py-3 px-4 text-xs md:text-sm transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Password</label>
                  <input required type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] outline-none rounded-2xl py-2.5 md:py-3 px-4 text-xs md:text-sm transition-all" />
                </div>
                <button type="submit" className="w-full bg-[#D4537E] text-white py-3 md:py-3.5 rounded-full text-sm md:text-base font-bold shadow-md hover:bg-[#b8436b] hover:shadow-lg transition-all transform hover:-translate-y-0.5 mt-2">
                  {isLogin ? 'Log In' : 'Create Account'}
                </button>
              </form>
              <div className="mt-6 text-center text-xs md:text-sm">
                <span className="text-gray-500">{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                <button onClick={() => { setIsLogin(!isLogin); setPassword(""); }} className="text-[#D4537E] font-bold ml-1.5 hover:underline">
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LOGGED IN STATE ---
  return (
    <div className="min-h-screen bg-[#fdf8f5] text-[#2C2C2A] font-sans pb-24 relative overflow-x-hidden">
      
      {/* --- LIVE ORDER TRACKER MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Order Details</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5"/>
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-2xl font-black text-[#2C2C2A]">{selectedOrder.id}</p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">{selectedOrder.date}</p>
                </div>
                {getStatusBadge(selectedOrder.status)}
              </div>
              
              {/* Tracker Timeline */}
              <div className="mb-6 bg-[#fdf8f5] p-5 rounded-2xl border border-[#f0e8e0]">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Live Status</p>
                <div className="space-y-5 relative">
                  
                  {/* Connecting Lines */}
                  <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gray-200 z-0"></div>
                  
                  <div className="flex gap-4 items-start relative z-10">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-[3px] shadow-sm flex-shrink-0 ${getStepStatus(selectedOrder.status, "Awaiting Verification") ? 'bg-amber-400 border-amber-100 text-white' : 'bg-gray-100 border-gray-50 text-gray-300'}`}><Clock className="w-3 h-3"/></div>
                    <div>
                      <p className={`text-sm font-bold ${getStepStatus(selectedOrder.status, "Awaiting Verification") ? 'text-gray-900' : 'text-gray-400'}`}>Payment Received</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Admin is verifying your receipt.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start relative z-10">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-[3px] shadow-sm flex-shrink-0 ${getStepStatus(selectedOrder.status, "Preparing to Ship") ? 'bg-blue-500 border-blue-100 text-white' : 'bg-white border-gray-200 text-gray-300'}`}><Package className="w-3 h-3"/></div>
                    <div>
                      <p className={`text-sm font-bold ${getStepStatus(selectedOrder.status, "Preparing to Ship") ? 'text-gray-900' : 'text-gray-400'}`}>Preparing Order</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Your items are being packed securely.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start relative z-10">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-[3px] shadow-sm flex-shrink-0 ${getStepStatus(selectedOrder.status, "Shipped") ? 'bg-emerald-500 border-emerald-100 text-white' : 'bg-white border-gray-200 text-gray-300'}`}><Truck className="w-3 h-3"/></div>
                    <div>
                      <p className={`text-sm font-bold ${getStepStatus(selectedOrder.status, "Shipped") ? 'text-gray-900' : 'text-gray-400'}`}>Ready for Handover</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Order is complete and awaiting pickup/delivery.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fulfillment Data */}
              <div className="mb-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2">Fulfillment Details</p>
                {selectedOrder.shippingMethod === 'pickup' ? (
                  <div className="flex items-start gap-3 mt-3">
                    <Store className="w-4 h-4 text-[#D4537E] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-sm text-gray-900">Campus Meetup</p>
                      <p className="text-xs text-gray-600 mt-0.5">{selectedOrder.pickupSchedule || 'Schedule pending'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 mt-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-sm text-gray-900">Delivery via {selectedOrder.shippingMethod === 'lalamove' ? 'Lalamove' : 'J&T Express'}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{selectedOrder.customer.address}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Order Items */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Order Items</p>
                <div className="space-y-3 mb-5">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700 font-medium"><span className="font-bold bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 mr-2">{item.qty}x</span> {item.name}</span>
                      <span className="font-bold text-gray-900">₱{(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                  <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Value</span>
                  <span className="text-xl font-black text-[#D4537E]">₱{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* STICKY NAV */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#f0e8e0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center text-sm font-medium text-gray-500 overflow-hidden whitespace-nowrap">
            <Link href="/" className="hover:text-[#D4537E] transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-1 opacity-50 flex-shrink-0" />
            <span className="text-[#2C2C2A]">My Account</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
            <Link href="/catalog" className="flex items-center gap-2 bg-[#2C2C2A] text-white px-3.5 py-2 md:px-5 md:py-3 rounded-full text-sm font-medium hover:bg-black transition-colors">
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden xs:inline">My bag</span>
              {cartItemCount > 0 && <span className="bg-white text-[#2C2C2A] text-xs font-semibold px-2 py-0.5 rounded-full ml-0.5 md:ml-1">{cartItemCount}</span>}
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight mb-1.5 md:mb-2">Welcome back, {user.name}!</h1>
            <p className="text-gray-500 text-xs md:text-sm flex items-center gap-1.5 md:gap-2">
              <Building className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400" /> {user.school} 
              <span className="text-gray-300">•</span> {user.college} 
              <span className="text-gray-300">•</span> <GraduationCap className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400" /> {user.yearLevel}
            </p>
          </div>
          <button onClick={logout} className="flex items-center justify-center gap-2 text-xs md:text-sm font-bold text-gray-500 hover:text-red-600 transition-colors bg-white border border-[#f0e8e0] px-4 md:px-5 py-2 md:py-2.5 rounded-full hover:border-red-200 hover:bg-red-50 w-full sm:w-auto">
            <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" /> Sign out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-[#D4537E] to-[#E47B9D] rounded-[20px] md:rounded-[24px] p-6 text-white shadow-lg relative overflow-hidden">
              <Sparkles className="absolute top-4 right-4 w-12 h-12 text-white/20" />
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                <TicketPercent className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-1">Iskolar VIP</h3>
              <p className="text-white/90 text-xs md:text-sm mb-5 leading-relaxed">Your 10% member discount is active and applies automatically at checkout.</p>
              <Link href="/catalog" className="inline-block bg-white text-[#D4537E] text-[10px] md:text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full shadow-sm hover:scale-105 transition-transform">
                Shop now
              </Link>
            </div>
            
            {/* LIVE ORDER HISTORY (NOW CLICKABLE!) */}
            <div className="bg-white border border-[#f0e8e0] rounded-[20px] p-5 shadow-sm">
               <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center justify-between">
                 <span className="flex items-center gap-2"><Box className="w-4 h-4 text-[#D4537E]"/> Order History</span>
                 <span className="bg-[#fdf8f5] text-[#D4537E] text-[10px] px-2 py-0.5 rounded-full">{myOrders.length}</span>
               </h3>
               
               {myOrders.length === 0 ? (
                 <p className="text-xs text-gray-500 italic text-center py-4">You haven't placed any orders yet.</p>
               ) : (
                 <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                   {myOrders.map(order => (
                     <div 
                       key={order.id} 
                       onClick={() => setSelectedOrder(order)}
                       className="border border-gray-100 rounded-xl p-4 cursor-pointer hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm"
                     >
                       <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-bold text-gray-900 tracking-wider">{order.id}</p>
                          <p className="text-xs font-black text-[#D4537E]">₱{order.total.toFixed(2)}</p>
                       </div>
                       <p className="text-[10px] text-gray-400 mb-3">{order.date} • {order.items.length} items</p>
                       {getStatusBadge(order.status)}
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white border border-[#f0e8e0] rounded-[20px] md:rounded-[24px] p-6 md:p-8 shadow-sm min-h-[300px]">
              <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center justify-between border-b border-[#f0e8e0] pb-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#D4537E] fill-[#D4537E]" /> 
                  <span>Your Wishlist</span>
                </div>
                <span className="text-xs font-medium bg-[#FBEAF0] text-[#D4537E] px-2.5 py-1 rounded-full">{wishlist.length} saved</span>
              </h2>
              
              {wishlist.length === 0 ? (
                <div className="text-center py-10 md:py-16">
                  <div className="w-16 h-16 bg-[#fdf8f5] rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <Heart className="w-8 h-8" />
                  </div>
                  <p className="text-gray-500 text-sm mb-5">You haven't saved any aesthetics yet.</p>
                  <Link href="/catalog" className="inline-flex items-center gap-2 text-[#D4537E] font-bold hover:underline text-sm bg-[#FBEAF0] px-5 py-2.5 rounded-full">
                    Explore designs <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlist.map(id => {
                    const product = products.find(p => p.id === id);
                    if (!product) return null;

                    return (
                      <div key={id} className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-[16px] border border-[#f0e8e0] hover:border-[#D4537E]/40 hover:shadow-sm transition-all group bg-white relative">
                        <Link href={`/product/${id}`} className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-gradient-to-br ${product.color} flex-shrink-0 relative`}>
                          <img src={product.frontImage} alt={product.name} className="w-full h-full object-cover" />
                        </Link>
                        <div className="flex flex-col justify-center flex-1 min-w-0 pr-6">
                           <span className="text-[9px] md:text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">{product.category}</span>
                           <Link href={`/product/${id}`} className="font-bold text-[#2C2C2A] text-xs md:text-sm leading-tight hover:text-[#D4537E] truncate block mb-1">
                             {product.name}
                           </Link>
                           <p className="text-sm font-black text-[#D4537E]">₱{product.price.toFixed(2)}</p>
                        </div>
                        <button 
                          onClick={(e) => { e.preventDefault(); toggleWishlist(id); }}
                          className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}