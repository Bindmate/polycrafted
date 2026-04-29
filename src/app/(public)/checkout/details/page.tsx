"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/lib/store";
import { ChevronLeft, ChevronRight, Truck, Package, Store, MapPin, Phone, User as UserIcon, Calendar, Clock, X, Sparkles, CheckCircle2, ShoppingBag, Minus, Plus, Trash2, Ticket } from "lucide-react";

export default function CheckoutDetailsPage() {
  const router = useRouter();
  
  const { 
    items, getTotal, user, shippingDetails, updateShipping, 
    shippingMethod, setShippingMethod,
    schedules, fetchSchedules, selectedPickup, setPickupSchedule,
    products, fetchProducts, updateQuantity, removeItem,
    promoCode, discountFactor, applyPromo, removePromo
  } = useCheckoutStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // NEW: Promo Code State
  const [promoInput, setPromoInput] = useState("");
  const [promoStatus, setPromoStatus] = useState<{type: 'success' | 'error' | '', msg: string}>({type: '', msg: ''});

  useEffect(() => {
    fetchSchedules();
    if (products.length === 0) fetchProducts();
  }, [fetchSchedules, fetchProducts, products.length]);

  useEffect(() => {
    if (items.length === 0) {
      router.push('/catalog');
    }
  }, [items, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateShipping({ [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (shippingMethod === 'pickup' && !selectedPickup) {
      alert("Please select a pickup date and time!");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      router.push('/checkout/payment');
    }, 600);
  };

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const code = promoInput.toUpperCase();
    
    // Hardcoded Promo Logic for RTUJMAXPLC26
    if (code === 'RTUJMAXPLC26') {
      applyPromo(code, 0.5); // 50% discount
      setPromoStatus({ type: 'success', msg: '50% off applied! Vibe secured.' });
    } else {
      setPromoStatus({ type: 'error', msg: 'Invalid or expired promo code.' });
    }
  };

  const handleRemovePromo = () => {
    removePromo();
    setPromoInput("");
    setPromoStatus({ type: '', msg: '' });
  };

  const groupedSchedules = schedules.reduce((acc, curr) => {
    if (!acc[curr.date]) acc[curr.date] = [];
    acc[curr.date].push(curr);
    return acc;
  }, {} as Record<string, typeof schedules>);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  // CART MATH FOR MODAL
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  const baseTotal = items.reduce((acc, item) => acc + (item.quantity * 30), 0);
  
  // 1. Calculate base volume pricing
  let currentSubtotal = 0;
  if (cartItemCount === 1) {
    currentSubtotal = 30;
  } else if (cartItemCount >= 2) {
    currentSubtotal = 43 + ((cartItemCount - 2) * 24);
  }

  // 2. MINIMAL FIX: Apply member discount to the subtotal so the strikethrough price matches!
  if (user?.isMember) {
    currentSubtotal = currentSubtotal * 0.90;
  }

  // 3. Continue with the rest of the math
  const averageUnitPrice = cartItemCount > 0 ? currentSubtotal / cartItemCount : 30;
  const totalSavings = baseTotal - currentSubtotal;
  const upsellProducts = products.filter(p => !items.some(i => i.id === p.id)).slice(0, 4);
  const nextItemCost = cartItemCount === 1 ? 13 : 24;

  const handleQuickAdd = (product: any) => {
    useCheckoutStore.getState().addItem({ id: product.id, name: product.name, price: product.price, quantity: 1 });
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#fdf8f5] text-[#2C2C2A] font-sans pb-24">
      
      {/* --- CENTERED CART MODAL --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          
          <div className="bg-[#fdf8f5] w-full max-w-2xl max-h-[90vh] rounded-[24px] shadow-2xl flex flex-col overflow-hidden relative z-10 animate-in zoom-in-95 duration-200 border border-[#f0e8e0]">
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-[#f0e8e0] bg-white">
              <h2 className="text-lg md:text-xl font-bold text-[#2C2C2A] flex items-center gap-2">
                My Bag <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{cartItemCount}</span>
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-5 md:p-6 border-b border-[#f0e8e0] bg-white">
                {cartItemCount === 0 ? (
                  <div className="bg-[#FBEAF0] border border-[#D4537E]/20 p-4 rounded-xl flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#D4537E] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-[#D4537E] mb-1">Unlock Pair Pricing!</p>
                      <p className="text-xs text-gray-600">Buy any 2 stickers to drop the price to ₱24 each.</p>
                    </div>
                  </div>
                ) : cartItemCount === 1 ? (
                  <div className="bg-[#FBEAF0] border border-[#D4537E]/20 p-4 rounded-xl">
                    <p className="text-sm font-bold text-[#D4537E] mb-1">You're almost there!</p>
                    <p className="text-xs text-gray-600 mb-3">Add 1 more sticker to save ₱12 on your order.</p>
                    <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#D4537E]/20">
                      <div className="bg-[#D4537E] h-full w-1/2 transition-all duration-500"></div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#EAF3DE] border border-[#71A051]/20 p-4 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#71A051] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-[#71A051] mb-1">Pair Promo Active!</p>
                      <p className="text-xs text-[#27500A]">You're saving <strong>₱{totalSavings.toFixed(2)}</strong> on this order.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 md:p-6 bg-white">
                <ul className="space-y-4">
                  {items.map((item, index) => {
                    const cartProduct = products.find(p => p.id === item.id);
                    return (
                      <li key={`${item.id}-${index}`} className="flex gap-4 items-center bg-white p-3 md:p-4 rounded-[20px] border border-[#f0e8e0] shadow-sm">
                        <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-[14px] flex-shrink-0 flex items-center justify-center overflow-hidden relative bg-gradient-to-br ${cartProduct?.color || 'from-gray-100 to-gray-200'}`}>
                          {cartProduct?.frontImage ? (
                            <img src={cartProduct.frontImage} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs text-gray-400 font-bold">{item.name.split(' ')[0]}</span>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center rotate-[-25deg] pointer-events-none">
                            <span className="text-[10px] font-bold text-white/50 tracking-widest uppercase">Polycrafted</span>
                          </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between py-1 pr-2">
                          <div>
                            <div className="flex justify-between items-start">
                              <div>
                                {cartProduct && <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">{cartProduct.category}</span>}
                                <h4 className="text-sm md:text-base font-bold text-[#2C2C2A] leading-tight line-clamp-1">{item.name}</h4>
                              </div>
                              <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 p-1 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-end justify-between mt-3">
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full h-8 px-1">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black"><Minus className="w-3 h-3" /></button>
                              <span className="w-6 text-center text-xs font-bold text-[#2C2C2A]">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black"><Plus className="w-3 h-3" /></button>
                            </div>
                            
                            <div className="text-right">
                              {cartItemCount >= 2 && <p className="text-[10px] text-gray-400 line-through mb-0.5">₱{(30 * item.quantity).toFixed(2)}</p>}
                              <p className="text-sm md:text-base font-black text-[#D4537E]">₱{(averageUnitPrice * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {items.length > 0 && upsellProducts.length > 0 && (
                <div className="p-5 md:p-6 bg-[#fdf8f5] border-t border-[#f0e8e0]">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">You might also like (Add for just ₱{nextItemCost})</p>
                  <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
                    {upsellProducts.map(upsell => (
                      <div key={upsell.id} className="flex-shrink-0 w-28 group cursor-pointer" onClick={() => handleQuickAdd(upsell)}>
                        <div className={`w-full aspect-[1.58/1] rounded-xl relative overflow-hidden bg-gradient-to-br ${upsell.color} border border-gray-200 mb-2`}>
                          {upsell.frontImage && <img src={upsell.frontImage} className="w-full h-full object-cover" />}
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Plus className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <p className="text-[10px] font-medium text-gray-700 truncate">{upsell.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="p-5 md:p-6 border-t border-[#f0e8e0] bg-white mt-auto">
              {totalSavings > 0 && <p className="text-xs font-bold text-[#71A051] text-center mb-3">You saved ₱{totalSavings.toFixed(2)} with Pair Pricing!</p>}
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Subtotal</span>
                <div className="text-right">
                  {discountFactor > 0 && (
                    <span className="text-xs text-gray-400 line-through mr-2">₱{currentSubtotal.toFixed(2)}</span>
                  )}
                  <span className="text-2xl font-black text-[#2C2C2A]">₱{getTotal().toFixed(2)}</span>
                </div>
              </div>
              <button 
                type="button"
                className="w-full flex justify-center items-center bg-[#D4537E] text-white py-4 rounded-full text-base font-bold hover:bg-[#b8436b] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                onClick={() => setIsCartOpen(false)}
              >
                Continue Checkout
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Checkout Header */}
      <div className="bg-white border-b border-[#f0e8e0] sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base sm:text-lg font-bold">Shipping Details</h1>
          <div className="w-9" />
        </div>
        <div className="w-full bg-gray-100 h-1">
          <div className="bg-[#D4537E] h-full w-1/2 rounded-r-full"></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        
        {/* Order Summary Ribbon */}
        <div className="bg-white border border-[#f0e8e0] rounded-2xl p-4 mb-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FBEAF0] rounded-xl flex items-center justify-center text-[#D4537E]">
              <Package className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Order Total</p>
              <div className="flex items-center gap-2">
                {discountFactor > 0 && (
                   <span className="text-xs text-gray-400 line-through">₱{currentSubtotal.toFixed(2)}</span>
                )}
                <p className="text-base sm:text-lg font-bold text-[#2C2C2A]">₱{getTotal().toFixed(2)}</p>
              </div>
            </div>
          </div>
          <button type="button" onClick={() => setIsCartOpen(true)} className="text-xs font-bold text-[#D4537E] bg-[#FBEAF0] px-4 py-2 rounded-full hover:bg-[#f5d6e2] transition-colors">
            Edit Bag
          </button>
        </div>

        {/* PROMO CODE SECTION */}
        <div className="bg-white border border-[#f0e8e0] rounded-2xl p-4 mb-6 sm:mb-8 shadow-sm">
          {promoCode ? (
            <div className="flex items-center justify-between bg-[#EAF3DE] border border-[#71A051]/30 p-3 rounded-xl">
               <div className="flex items-center gap-2">
                 <Ticket className="w-4 h-4 text-[#71A051]" />
                 <span className="text-sm font-bold text-[#71A051]">{promoCode} Applied!</span>
               </div>
               <button onClick={handleRemovePromo} className="text-xs font-medium text-gray-500 hover:text-red-500 transition-colors">
                 Remove
               </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Ticket className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Have a promo code?"
                    className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] outline-none rounded-xl py-2.5 pl-10 pr-4 text-sm transition-all uppercase"
                  />
                </div>
                <button 
                  onClick={handleApplyPromo}
                  type="button"
                  className="bg-[#2C2C2A] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoStatus.msg && (
                <p className={`text-xs mt-2 ml-1 ${promoStatus.type === 'success' ? 'text-[#71A051]' : 'text-red-500'}`}>
                  {promoStatus.msg}
                </p>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          
          {/* SECTION 1: Delivery Method (MOVED UP) */}
          <section className="bg-white border border-[#f0e8e0] rounded-[24px] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#FBEAF0] text-[#D4537E] flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Delivery method</h2>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
              Shipping fees for delivery are estimated. We will verify your location and text you the exact shipping fee after you place your order!
            </p>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              
              <label className={`block relative p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${shippingMethod === 'jnt' ? 'border-[#D4537E] bg-[#FBEAF0]/30' : 'border-[#f0e8e0] hover:border-gray-300'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'jnt' ? 'border-[#D4537E]' : 'border-gray-300'}`}>
                      {shippingMethod === 'jnt' && <div className="w-2.5 h-2.5 bg-[#D4537E] rounded-full" />}
                    </div>
                    <div>
                      <span className="block font-bold text-sm sm:text-base text-[#2C2C2A]">J&T Express</span>
                      <span className="text-[10px] sm:text-xs text-gray-500 mt-0.5 block">1-3 days within Metro Manila</span>
                    </div>
                  </div>
                  <span className="font-bold text-sm sm:text-base text-[#2C2C2A]">Est. ₱70</span>
                </div>
                <input type="radio" name="shippingMethod" value="jnt" checked={shippingMethod === 'jnt'} onChange={() => setShippingMethod('jnt')} className="hidden" />
              </label>

              <label className={`block relative p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${shippingMethod === 'lalamove' ? 'border-[#D4537E] bg-[#FBEAF0]/30' : 'border-[#f0e8e0] hover:border-gray-300'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'lalamove' ? 'border-[#D4537E]' : 'border-gray-300'}`}>
                      {shippingMethod === 'lalamove' && <div className="w-2.5 h-2.5 bg-[#D4537E] rounded-full" />}
                    </div>
                    <div>
                      <span className="block font-bold text-sm sm:text-base text-[#2C2C2A]">Lalamove</span>
                      <span className="text-[10px] sm:text-xs text-gray-500 mt-0.5 block">Same-day delivery (Rush)</span>
                    </div>
                  </div>
                  <span className="font-bold text-sm sm:text-base text-[#2C2C2A]">Est. ₱150</span>
                </div>
                <input type="radio" name="shippingMethod" value="lalamove" checked={shippingMethod === 'lalamove'} onChange={() => setShippingMethod('lalamove')} className="hidden" />
              </label>

              <label className={`block relative p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${shippingMethod === 'pickup' ? 'border-[#D4537E] bg-[#FBEAF0]/30' : 'border-[#f0e8e0] hover:border-gray-300'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'pickup' ? 'border-[#D4537E]' : 'border-gray-300'}`}>
                      {shippingMethod === 'pickup' && <div className="w-2.5 h-2.5 bg-[#D4537E] rounded-full" />}
                    </div>
                    <div>
                      <span className="block font-bold text-sm sm:text-base text-[#2C2C2A] flex items-center gap-2">
                        Campus Meetup <span className="bg-[#71A051] text-white text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">Free</span>
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-500 mt-0.5 block">PUP Manila Main Campus</span>
                    </div>
                  </div>
                  <Store className={`w-5 h-5 ${shippingMethod === 'pickup' ? 'text-[#D4537E]' : 'text-gray-400'}`} />
                </div>
                <input type="radio" name="shippingMethod" value="pickup" checked={shippingMethod === 'pickup'} onChange={() => setShippingMethod('pickup')} className="hidden" />
              </label>
            </div>

            {/* Show Scheduler if Campus Pickup */}
            {shippingMethod === 'pickup' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-white border border-[#D4537E]/20 rounded-xl p-5">
                <div className="flex items-start gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-[#D4537E] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-[#2C2C2A] text-sm">Select your meetup schedule</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Please pick a time you are confident you can attend. <strong className="text-[#D4537E]">Wait for our confirmation on chat 12 hours before your schedule</strong> in case of sudden campus closures or availability changes.
                    </p>
                  </div>
                </div>

                {schedules.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-sm font-medium text-gray-600">No pickup schedules available right now.</p>
                    <p className="text-xs text-gray-400 mt-1">Please select J&T or Lalamove instead.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(groupedSchedules).map(([date, times]) => (
                      <div key={date}>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{formatDate(date)}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {times.map((schedule: any) => {
                            const isSelected = selectedPickup?.id === schedule.id;
                            return (
                              <button
                                key={schedule.id}
                                type="button"
                                onClick={() => setPickupSchedule(schedule)}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                                  isSelected 
                                    ? 'border-[#D4537E] bg-[#FBEAF0]/50 text-[#D4537E]' 
                                    : 'border-gray-100 bg-white hover:border-[#f0e8e0] text-gray-600'
                                }`}
                              >
                                <span className="font-bold text-xs sm:text-sm whitespace-nowrap">
                                  {formatTime(schedule.startTime)}
                                </span>
                                <span className={`text-[9px] sm:text-[10px] mt-0.5 ${isSelected ? 'text-[#D4537E]/70' : 'text-gray-400'}`}>
                                  to {formatTime(schedule.endTime)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* SECTION 2: Contact Info */}
          <section className="bg-white border border-[#f0e8e0] rounded-[24px] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <UserIcon className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Contact information</h2>
            </div>
            
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2 ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    required type="text" name="fullName" value={shippingDetails.fullName || (user?.name || '')} onChange={handleChange} 
                    placeholder="Juan Dela Cruz"
                    className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] outline-none rounded-xl py-3 pl-10 pr-4 text-sm transition-all" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    required type="tel" name="phone" value={shippingDetails.phone} onChange={handleChange} 
                    placeholder="0912 345 6789"
                    className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] outline-none rounded-xl py-3 pl-10 pr-4 text-sm transition-all" 
                  />
                </div>
              </div>

              <div className={`transition-all duration-300 ${shippingMethod === 'pickup' ? 'opacity-50 grayscale' : ''}`}>
                <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2 ml-1">
                  Complete Delivery Address 
                  {shippingMethod === 'pickup' && <span className="text-[#D4537E] normal-case tracking-normal font-medium ml-2">(Not needed for Campus Meetup)</span>}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-4 w-4 h-4 text-gray-400" />
                  <textarea 
                    required={shippingMethod !== 'pickup'} 
                    disabled={shippingMethod === 'pickup'}
                    name="address" 
                    value={shippingDetails.address} 
                    onChange={handleChange} 
                    placeholder="House/Unit No., Street Name, Barangay, City/Province, Zip Code. (Please include a landmark)"
                    rows={3}
                    className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] outline-none rounded-xl py-3 pl-10 pr-4 text-sm transition-all resize-none disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed" 
                  />
                </div>
              </div>
            </div>
          </section>

          <button 
            type="submit" 
            disabled={isLoading || (shippingMethod === 'pickup' && schedules.length === 0)}
            className={`w-full text-white py-4 sm:py-4 rounded-full text-base font-bold shadow-md transition-all flex justify-center items-center gap-2 ${
              isLoading || (shippingMethod === 'pickup' && schedules.length === 0)
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-[#D4537E] hover:bg-[#b8436b] hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? 'Processing...' : 'Continue to Payment'} 
            {!isLoading && <ChevronRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}