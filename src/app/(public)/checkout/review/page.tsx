"use client";
import { useState } from "react";
import { useCheckoutStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { SearchCheck, MapPin, Wallet, AlertCircle, UploadCloud, CheckCircle2 } from "lucide-react";

export default function ReviewStep() {
  const router = useRouter();
  const { shippingDetails, paymentMethod, getTotal, clearCart } = useCheckoutStore();
  
  // NEW: State to track if a file was uploaded
  const [fileName, setFileName] = useState<string | null>(null);

  const handlePlaceOrder = () => {
    if (!fileName) return; // Failsafe just in case
    // 1. Clear the cart
    clearCart();
    // 2. Redirect to the success page
    router.push('/success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const getPaymentName = () => {
    if (paymentMethod === 'gcash') return 'GCash';
    if (paymentMethod === 'maya') return 'Maya';
    if (paymentMethod === 'bank_transfer') return 'Bank Transfer';
    return 'Not Selected';
  };

  const total = getTotal();
  const downpayment = total * 0.5;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-[#FBEAF0] text-[#D4537E] flex items-center justify-center">
          <SearchCheck className="w-4 h-4" />
        </div>
        <h2 className="text-2xl font-medium tracking-tight">Double-check your haul</h2>
      </div>
      <p className="text-gray-500 text-sm mb-8 ml-11">Make sure everything looks perfect before we lock it in.</p>

      <div className="space-y-6">
        {/* Shipping Review Block */}
        <div className="bg-[#fdf8f5] border border-[#f0e8e0] rounded-[20px] p-5">
          <div className="flex items-center justify-between mb-4 border-b border-[#f0e8e0] pb-3">
            <h3 className="font-medium text-[#2C2C2A] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" /> Delivery to
            </h3>
            <button onClick={() => router.push('/checkout/details')} className="text-xs text-[#D4537E] font-medium hover:underline">Edit</button>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-[#2C2C2A]">{shippingDetails.fullName || 'Missing Name'}</p>
            <p>{shippingDetails.phone || 'Missing Phone'}</p>
            <p className="pt-1">{shippingDetails.address || 'Missing Address'}</p>
          </div>
        </div>

        {/* Payment Review Block */}
        <div className="bg-[#fdf8f5] border border-[#f0e8e0] rounded-[20px] p-5">
          <div className="flex items-center justify-between mb-4 border-b border-[#f0e8e0] pb-3">
            <h3 className="font-medium text-[#2C2C2A] flex items-center gap-2">
              <Wallet className="w-4 h-4 text-gray-400" /> Payment method
            </h3>
            <button onClick={() => router.push('/checkout/payment')} className="text-xs text-[#D4537E] font-medium hover:underline">Edit</button>
          </div>
          
          <div className="text-sm text-gray-600 mb-4">
            <p className="font-medium text-[#2C2C2A]">{getPaymentName()}</p>
          </div>

          {/* Dynamic Payment Instruction */}
          {paymentMethod === 'gcash' && (
            <div className="bg-white p-4 rounded-[14px] border border-[#f0e8e0] shadow-sm">
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-[#D4537E] flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-[#2C2C2A]">
                  You need to send <span className="text-[#D4537E] font-bold">₱{downpayment.toFixed(2)}</span> to secure this order.
                </p>
              </div>
              <div className="bg-[#fdf8f5] p-3 rounded-lg text-xs space-y-1">
                <p><span className="text-gray-400">Name:</span> <span className="font-medium text-[#2C2C2A]">Jhon Luke L.</span></p>
                <p><span className="text-gray-400">Number:</span> <span className="font-medium text-[#2C2C2A]">0994-856-5485</span></p>
              </div>
            </div>
          )}

          {/* NEW: Proof of Payment Upload */}
          <div className="bg-white p-5 rounded-[16px] border border-[#f0e8e0] shadow-sm mt-5">
            <h3 className="font-medium text-[#2C2C2A] flex items-center gap-2 mb-2">
              <UploadCloud className="w-4 h-4 text-gray-400" /> Upload payment proof
            </h3>
            <p className="text-xs text-gray-500 mb-4">Please upload a screenshot of your successful 50% downpayment transaction to proceed.</p>

            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${fileName ? 'border-[#71A051] bg-[#EAF3DE]/30' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                {fileName ? (
                  <>
                    <CheckCircle2 className="w-8 h-8 text-[#71A051] mb-2" />
                    <p className="text-sm font-medium text-[#71A051] truncate w-full max-w-[200px]">{fileName}</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-600">Click to upload screenshot</p>
                    <p className="text-[10px] text-gray-400 mt-1">PNG or JPG</p>
                  </>
                )}
              </div>
              <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleFileUpload} />
            </label>
          </div>

        </div>
      </div>

      <div className="mt-10 flex gap-4">
        <button 
          type="button" 
          onClick={() => router.push('/checkout/payment')}
          className="w-1/3 bg-white border border-[#f0e8e0] text-gray-700 py-4 rounded-full text-base font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button 
          onClick={handlePlaceOrder}
          disabled={!fileName} // Button is disabled if no file is uploaded!
          className={`w-2/3 py-4 rounded-full text-base font-medium shadow-sm transition-all duration-300 ${
            fileName 
              ? 'bg-[#2C2C2A] text-white hover:bg-black cursor-pointer' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {fileName ? 'Place Order' : 'Upload proof to place order'}
        </button>
      </div>
    </div>
  );
}