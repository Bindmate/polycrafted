"use client";
import { useCheckoutStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Wallet, SmartphoneNfc, Landmark, CheckCircle2, AlertCircle, Ticket } from "lucide-react";

export default function PaymentStep() {
  const router = useRouter();
  const { paymentMethod, setPaymentMethod, getTotal, promoCode } = useCheckoutStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert("Please select a vibe for payment.");
      return;
    }
    router.push('/checkout/review');
  };

  const PAYMENT_OPTIONS = [
    { id: 'gcash', name: 'GCash', desc: 'Pay instantly via QR code or number', icon: SmartphoneNfc, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'maya', name: 'Maya', desc: 'Secure payment via Maya number', icon: Wallet, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 'bank_transfer', name: 'Bank Transfer', desc: 'BDO / BPI / UnionBank', icon: Landmark, color: 'text-[#D28E3D]', bg: 'bg-[#FAEEDA]' },
  ];

  return (
    <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-[#FBEAF0] text-[#D4537E] flex items-center justify-center">
          <Wallet className="w-4 h-4" />
        </div>
        <h2 className="text-2xl font-medium tracking-tight">Payment method</h2>
      </div>
      <p className="text-gray-500 text-sm mb-6 ml-11">How are we settling this haul?</p>

      {/* Downpayment Notice */}
      <div className="mb-8 flex items-start gap-3 bg-[#FAEEDA]/50 border border-[#FAEEDA] text-[#633806] p-4 rounded-[16px]">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#D28E3D]" />
        <div>
          <p className="text-sm font-medium">50% Downpayment Required</p>
          <p className="text-xs mt-0.5 opacity-80">
            To process and ship out your order, we require a 50% downpayment of your total items 
            {promoCode && <span className="font-bold text-[#D4537E]"> (discounted via promo!)</span>}. 
            The remaining balance can be settled later!
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {PAYMENT_OPTIONS.map((option) => {
          const isSelected = paymentMethod === option.id;
          return (
            <div 
              key={option.id}
              className={`rounded-[20px] border-2 transition-all duration-300 overflow-hidden ${
                isSelected ? 'border-[#D4537E] bg-[#FBEAF0]/20' : 'border-[#f0e8e0] bg-[#fdf8f5] hover:border-gray-300'
              }`}
            >
              <div 
                onClick={() => setPaymentMethod(option.id as any)}
                className="cursor-pointer p-5 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${option.bg} ${option.color}`}>
                  <option.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium text-base ${isSelected ? 'text-[#D4537E]' : 'text-[#2C2C2A]'}`}>{option.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{option.desc}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#D4537E] bg-[#D4537E]' : 'border-gray-300'}`}>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
              </div>

              {isSelected && option.id === 'gcash' && (
                <div className="px-5 pb-5 pt-1 border-t border-[#D4537E]/10 mt-1 animate-in fade-in slide-in-from-top-2">
                  <p className="text-sm font-medium text-[#2C2C2A] mb-3 ml-[4.25rem]">Send your downpayment here:</p>
                  
                  <div className="ml-[4.25rem] space-y-2">
                    <div className="bg-white p-3.5 rounded-[14px] border border-[#f0e8e0] flex justify-between items-center shadow-sm">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">GCash Name</p>
                        <p className="text-sm font-medium text-[#2C2C2A]">Jhon Luke L.</p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3.5 rounded-[14px] border border-[#f0e8e0] flex justify-between items-center shadow-sm">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">GCash Number</p>
                        <p className="text-sm font-medium text-[#2C2C2A]">0994-856-5485</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isSelected && option.id !== 'gcash' && (
                <div className="px-5 pb-5 pt-1 border-t border-[#D4537E]/10 mt-1 animate-in fade-in slide-in-from-top-2">
                   <p className="text-xs text-gray-500 ml-[4.25rem] italic">Account details will be provided upon review.</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-10 flex gap-4">
        <button 
          type="button" 
          onClick={() => router.push('/checkout/details')}
          className="w-1/3 bg-white border border-[#f0e8e0] text-gray-700 py-4 rounded-full text-base font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button 
          type="submit" 
          className="w-2/3 bg-[#D4537E] text-white py-4 rounded-full text-base font-medium shadow-sm hover:bg-[#b8436b] transition-colors"
        >
          Review Order
        </button>
      </div>
    </form>
  );
}