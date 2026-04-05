"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, ShieldCheck, ChevronLeft } from "lucide-react";
import { useCheckoutStore } from "@/lib/store";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { items, getTotal, shippingMethod } = useCheckoutStore();

  const steps = [
    { name: "Details", path: "/checkout/details", number: 1 },
    { name: "Payment", path: "/checkout/payment", number: 2 },
    { name: "Review", path: "/checkout/review", number: 3 },
  ];

  const currentStepIndex = steps.findIndex(s => s.path === pathname);

  return (
    <div className="min-h-screen bg-[#fdf8f5] text-[#2C2C2A] font-sans pb-24">
      
      {/* Secure Navbar */}
      <nav className="bg-white border-b border-[#f0e8e0] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/catalog" className="flex items-center gap-2 text-gray-500 hover:text-[#D4537E] transition-colors text-sm font-medium">
            <ChevronLeft className="w-4 h-4" /> Back to catalog
          </Link>
          <div className="text-xl font-medium tracking-tight">
            pup<span className="text-[#D4537E]">merch</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#71A051] text-sm font-medium">
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Secure Checkout</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pt-8 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* LEFT COLUMN: The Forms */}
          <div className="lg:col-span-7">
            
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-10 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-[#f0e8e0] z-0"></div>
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#D4537E] z-0 transition-all duration-500"
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              ></div>
              
              {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isPassed = index < currentStepIndex;
                return (
                  <div key={step.name} className="relative z-10 flex flex-col items-center gap-2 bg-[#fdf8f5] px-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      isActive ? "bg-[#D4537E] text-white ring-4 ring-[#FBEAF0]" : 
                      isPassed ? "bg-[#2C2C2A] text-white" : 
                      "bg-white border-2 border-[#f0e8e0] text-gray-400"
                    }`}>
                      {step.number}
                    </div>
                    <span className={`text-xs font-medium ${isActive ? "text-[#D4537E]" : isPassed ? "text-[#2C2C2A]" : "text-gray-400"}`}>
                      {step.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Renders the current step's page.tsx */}
            <div className="bg-white border border-[#f0e8e0] rounded-[24px] p-6 sm:p-10 shadow-sm">
              {children}
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Order Summary */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24 bg-white border border-[#f0e8e0] rounded-[24px] p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4">Order summary</h2>
              
              {/* Items List */}
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
                {items.length === 0 ? (
                  <p className="text-sm text-gray-500">Your bag is empty.</p>
                ) : (
                  items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-[#fdf8f5] border border-[#f0e8e0] flex items-center justify-center flex-shrink-0 text-[10px] text-gray-400 uppercase font-bold text-center p-2">
                        {item.name.split(' ')[0]}
                      </div>
                      <div className="flex-1 flex justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-[#2C2C2A] line-clamp-2">{item.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-[#2C2C2A]">₱{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-[#f0e8e0] pt-4 space-y-3">
                <div className="flex justify-between items-start text-sm text-gray-500">
                  <span>Shipping</span>
                  <div className="text-right">
                    <span className="text-[#2C2C2A] font-medium">
                      {shippingMethod === 'jnt' ? 'Est. ₱70.00' : 'Est. ₱150.00'}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">(Finalized after checkout)</p>
                  </div>
                </div>
                <div className="flex justify-between items-end pt-3 border-t border-[#f0e8e0]">
                  <div>
                    <span className="text-base font-medium block">Items Total</span>
                  </div>
                  <span className="text-2xl font-bold text-[#2C2C2A]">₱{getTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="mt-6 flex items-start gap-3 bg-[#EAF3DE] text-[#27500A] p-4 rounded-[16px]">
              <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Iskolar Guarantee</p>
                <p className="text-xs mt-0.5 opacity-80">Protected payments, easy tracking, and hassle-free replacements if damaged during transit.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}