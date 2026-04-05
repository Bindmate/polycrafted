"use client";
import { useCheckoutStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { MapPin, Truck, AlertCircle } from "lucide-react";

export default function DetailsStep() {
  const router = useRouter();
  const { shippingDetails, updateShipping, shippingMethod, setShippingMethod } = useCheckoutStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/checkout/payment');
  };

  return (
    <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-[#FBEAF0] text-[#D4537E] flex items-center justify-center">
          <MapPin className="w-4 h-4" />
        </div>
        <h2 className="text-2xl font-medium tracking-tight">Delivery details</h2>
      </div>
      <p className="text-gray-500 text-sm mb-8 ml-11">Where are we dropping off your aesthetic haul?</p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Full name</label>
          <input
            required
            type="text"
            placeholder="Juan Dela Cruz"
            value={shippingDetails.fullName}
            onChange={(e) => updateShipping({ fullName: e.target.value })}
            className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] focus:ring-2 focus:ring-[#D4537E]/20 outline-none rounded-2xl py-3.5 px-4 text-sm transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Phone number <span className="text-xs text-gray-400 font-normal">(for delivery updates)</span></label>
          <input
            required
            type="tel"
            placeholder="0912 345 6789"
            value={shippingDetails.phone}
            onChange={(e) => updateShipping({ phone: e.target.value })}
            className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] focus:ring-2 focus:ring-[#D4537E]/20 outline-none rounded-2xl py-3.5 px-4 text-sm transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Complete address</label>
          <textarea
            required
            rows={3}
            placeholder="Unit/House No., Street Name, Barangay, City/Province"
            value={shippingDetails.address}
            onChange={(e) => updateShipping({ address: e.target.value })}
            className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] focus:ring-2 focus:ring-[#D4537E]/20 outline-none rounded-2xl py-3.5 px-4 text-sm transition-all resize-none"
          />
        </div>
      </div>

      {/* SHIPPING METHOD SECTION */}
      <div className="mt-10 pt-8 border-t border-[#f0e8e0]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FBEAF0] text-[#D4537E] flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-medium tracking-tight">Shipping preference</h3>
          </div>
        </div>
        
        {/* Disclaimer Notice */}
        <div className="flex items-start gap-2 bg-blue-50 text-blue-700 p-3 rounded-[12px] mb-5 text-xs font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>These are estimated costs. We will verify your location and text you the exact shipping fee after you place your order!</p>
        </div>

        <div className="space-y-4">
          
          {/* Option 1: J&T Express */}
          <label className={`flex cursor-pointer items-center justify-between rounded-[20px] border-2 p-5 transition-all duration-200 ${
            shippingMethod === 'jnt' ? 'border-[#D4537E] bg-[#FBEAF0]/30' : 'border-[#f0e8e0] bg-[#fdf8f5] hover:border-gray-300'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${shippingMethod === 'jnt' ? 'border-[#D4537E] bg-[#D4537E]' : 'border-gray-300 bg-white'}`}>
                {shippingMethod === 'jnt' && <div className="w-2 h-2 rounded-full bg-white"></div>}
              </div>
              <div>
                <p className={`font-medium ${shippingMethod === 'jnt' ? 'text-[#D4537E]' : 'text-[#2C2C2A]'}`}>J&T Express</p>
                <p className="text-xs text-gray-500 mt-0.5">1-3 days delivery within Metro Manila</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-right">
              <span className="font-medium text-[#2C2C2A]">Est. ₱70</span>
              <input 
                type="radio" name="shipping" className="hidden" 
                checked={shippingMethod === 'jnt'} 
                onChange={() => setShippingMethod('jnt')} 
              />
            </div>
          </label>

          {/* Option 2: Lalamove */}
          <label className={`flex cursor-pointer items-center justify-between rounded-[20px] border-2 p-5 transition-all duration-200 ${
            shippingMethod === 'lalamove' ? 'border-[#D4537E] bg-[#FBEAF0]/30' : 'border-[#f0e8e0] bg-[#fdf8f5] hover:border-gray-300'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${shippingMethod === 'lalamove' ? 'border-[#D4537E] bg-[#D4537E]' : 'border-gray-300 bg-white'}`}>
                {shippingMethod === 'lalamove' && <div className="w-2 h-2 rounded-full bg-white"></div>}
              </div>
              <div>
                <p className={`font-medium ${shippingMethod === 'lalamove' ? 'text-[#D4537E]' : 'text-[#2C2C2A]'}`}>Lalamove</p>
                <p className="text-xs text-gray-500 mt-0.5">Same-day delivery (Rush)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-right">
              <span className="font-medium text-[#2C2C2A]">Est. ₱150</span>
              <input 
                type="radio" name="shipping" className="hidden" 
                checked={shippingMethod === 'lalamove'} 
                onChange={() => setShippingMethod('lalamove')} 
              />
            </div>
          </label>
        </div>
      </div>

      <div className="mt-10">
        <button 
          type="submit" 
          className="w-full bg-[#D4537E] text-white py-4 rounded-full text-base font-medium shadow-sm hover:bg-[#b8436b] transition-colors"
        >
          Continue to payment
        </button>
      </div>
    </form>
  );
}