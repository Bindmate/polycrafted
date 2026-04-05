"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/lib/store";
import { ChevronLeft, ChevronRight, Truck, Package, Store, MapPin, Map, Phone, User as UserIcon, Calendar, Clock } from "lucide-react";

export default function CheckoutDetailsPage() {
  const router = useRouter();
  // PULL IN THE NEW SCHEDULING LOGIC
  const { 
    items, getTotal, user, shippingDetails, updateShipping, 
    shippingMethod, setShippingMethod,
    schedules, fetchSchedules, selectedPickup, setPickupSchedule 
  } = useCheckoutStore();

  const [isLoading, setIsLoading] = useState(false);

  // Fetch the active schedules when they open the checkout page!
  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // If cart is empty, send them back to catalog
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
    
    // Safety check: If they chose pickup but didn't select a schedule
    if (shippingMethod === 'pickup' && !selectedPickup) {
      alert("Please select a pickup date and time!");
      return;
    }

    setIsLoading(true);
    // Fake loading for transition effect
    setTimeout(() => {
      router.push('/checkout/payment');
    }, 600);
  };

  // Group schedules by Date so we can show them cleanly
  const groupedSchedules = schedules.reduce((acc, curr) => {
    if (!acc[curr.date]) acc[curr.date] = [];
    acc[curr.date].push(curr);
    return acc;
  }, {} as Record<string, typeof schedules>);

  // Format dates nicely (e.g., "Monday, Apr 12")
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format times nicely (e.g., "13:00:00" -> "1:00 PM")
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#fdf8f5] text-[#2C2C2A] font-sans pb-24">
      
      {/* Checkout Header */}
      <div className="bg-white border-b border-[#f0e8e0] sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base sm:text-lg font-bold">Shipping Details</h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
        
        {/* Progress Steps */}
        <div className="w-full bg-gray-100 h-1">
          <div className="bg-[#D4537E] h-full w-1/2 rounded-r-full"></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        
        {/* Order Summary Ribbon */}
        <div className="bg-white border border-[#f0e8e0] rounded-2xl p-4 mb-6 sm:mb-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FBEAF0] rounded-xl flex items-center justify-center text-[#D4537E]">
              <Package className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Order Total</p>
              <p className="text-base sm:text-lg font-bold text-[#2C2C2A]">₱{getTotal().toFixed(2)}</p>
            </div>
          </div>
          <Link href="/catalog" className="text-xs font-bold text-[#D4537E] bg-[#FBEAF0] px-3 py-1.5 rounded-full hover:bg-[#f5d6e2] transition-colors">
            Edit Bag
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          
          {/* SECTION 1: Contact Info */}
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
            </div>
          </section>

          {/* SECTION 2: Delivery Method */}
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
              
              {/* Option 1: J&T */}
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

              {/* Option 2: Lalamove */}
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

              {/* NEW Option 3: Campus Pickup (Only heavily promoted if logged in as PUP) */}
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
                      <span className="text-[10px] sm:text-xs text-gray-500 mt-0.5 block">PUP Manila Main Campus (Mural/Pylon)</span>
                    </div>
                  </div>
                  <Store className={`w-5 h-5 ${shippingMethod === 'pickup' ? 'text-[#D4537E]' : 'text-gray-400'}`} />
                </div>
                <input type="radio" name="shippingMethod" value="pickup" checked={shippingMethod === 'pickup'} onChange={() => setShippingMethod('pickup')} className="hidden" />
              </label>
            </div>

            {/* DYNAMIC CONTENT BASED ON SHIPPING SELECTION */}
            
            {/* Show Address Field if Delivery */}
            {shippingMethod !== 'pickup' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2 ml-1">Complete Delivery Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-4 w-4 h-4 text-gray-400" />
                  <textarea 
                    required name="address" value={shippingDetails.address} onChange={handleChange} 
                    placeholder="House/Unit No., Street Name, Barangay, City/Province, Zip Code"
                    rows={3}
                    className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] outline-none rounded-xl py-3 pl-10 pr-4 text-sm transition-all resize-none" 
                  />
                </div>
              </div>
            )}

            {/* Show Scheduler if Campus Pickup */}
            {shippingMethod === 'pickup' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-white border border-[#D4537E]/20 rounded-xl p-5">
                <div className="flex items-start gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-[#D4537E] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-[#2C2C2A] text-sm">Select your meetup schedule</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Please pick a time you are confident you can attend. <strong className="text-[#D4537E]">Wait for our SMS confirmation 12 hours before your schedule</strong> in case of sudden campus closures or availability changes.
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
                          {times.map(schedule => {
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