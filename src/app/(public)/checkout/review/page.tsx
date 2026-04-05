"use client";
import { useState } from "react";
import { useCheckoutStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { SearchCheck, MapPin, Wallet, AlertCircle, UploadCloud, CheckCircle2, Loader2, Store, Sparkles, ScanLine } from "lucide-react";
import Tesseract from 'tesseract.js'; // NEW: Import the real AI OCR

export default function ReviewStep() {
  const router = useRouter();
  
  const { shippingDetails, paymentMethod, shippingMethod, selectedPickup, getTotal, placeOrder } = useCheckoutStore();
  
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileObject, setFileObject] = useState<File | null>(null);
  const [referenceNo, setReferenceNo] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false); 
  const [aiDidFill, setAiDidFill] = useState(false); 

  const handlePlaceOrder = async () => {
    if (!fileName || !fileObject || !referenceNo) {
      alert("Please upload your receipt and provide the Reference Number.");
      return;
    }
    
    setIsSubmitting(true);
    
    const success = await placeOrder(
      { method: paymentMethod || 'Unknown', referenceNo: referenceNo },
      fileObject
    );

    if (success) {
      router.push('/success');
    } else {
      alert("Something went wrong placing your order. Please check your internet connection and try again.");
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileObject(file);
      setFileName(file.name);
      
      // --- THE REAL AI SCANNER ---
      setIsScanning(true);
      setAiDidFill(false);
      setReferenceNo(""); // Clear old number while scanning
      
      try {
        // 1. Tell Tesseract to read the English numbers on the image
        const result = await Tesseract.recognize(file, 'eng');
        const rawText = result.data.text;

        // 2. Clean the text (GCash often puts spaces between the reference numbers)
        const cleanedText = rawText.replace(/\s+/g, '');

        // 3. Use Regex to hunt for exactly 12 or 13 consecutive numbers
        // GCash is usually 13 digits, Maya is sometimes 12.
        const match = cleanedText.match(/\d{12,13}/);

        if (match) {
          setReferenceNo(match[0]); // Boom! Found it.
          setAiDidFill(true);
        } else {
          // If the image is blurry and it can't find a 13 digit number
          alert("Our AI couldn't clearly read the Reference Number from that image. Please type it in manually.");
        }

      } catch (error) {
        console.error("OCR Error:", error);
        alert("Scanner encountered an error. Please enter the Reference Number manually.");
      } finally {
        setIsScanning(false);
      }
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
              {shippingMethod === 'pickup' ? (
                <><Store className="w-4 h-4 text-[#D4537E]" /> Campus Meetup</>
              ) : (
                <><MapPin className="w-4 h-4 text-gray-400" /> Delivery to</>
              )}
            </h3>
            <button onClick={() => router.push('/checkout/details')} className="text-xs text-[#D4537E] font-medium hover:underline">Edit</button>
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-[#2C2C2A]">{shippingDetails.fullName || 'Missing Name'}</p>
            <p className="mb-2">{shippingDetails.phone || 'Missing Phone'}</p>
            
            {shippingMethod === 'pickup' ? (
              <div className="mt-3 bg-white p-3 rounded-xl border border-emerald-100 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-900 text-xs">PUP Manila Main Campus</p>
                  <p className="text-xs text-emerald-700 mt-0.5">{selectedPickup ? `${new Date(selectedPickup.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • ${selectedPickup.startTime} - ${selectedPickup.endTime}` : 'No schedule selected'}</p>
                </div>
              </div>
            ) : (
              <p className="pt-2 border-t border-[#f0e8e0]/50">{shippingDetails.address || 'Missing Address'}</p>
            )}
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

          {(paymentMethod === 'gcash' || paymentMethod === 'maya') && (
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

          {/* Reference Number Input & Image Upload */}
          <div className="bg-white p-5 rounded-[16px] border border-[#f0e8e0] shadow-sm mt-5">
            <div className="flex justify-between items-end mb-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Reference Number</label>
              {aiDidFill && (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 animate-in fade-in">
                  <Sparkles className="w-3 h-3" /> AI Extracted
                </span>
              )}
            </div>
            
            <div className="relative mb-6">
              <input 
                required 
                type="text" 
                placeholder="e.g., 8091 2345 6789 123" 
                value={referenceNo} 
                onChange={(e) => { setReferenceNo(e.target.value); setAiDidFill(false); }} 
                disabled={isScanning}
                className={`w-full bg-[#fdf8f5] border outline-none rounded-xl py-3 px-4 text-sm font-mono tracking-wider transition-all ${
                  aiDidFill ? 'border-emerald-300 bg-emerald-50 text-emerald-900 focus:border-emerald-400' : 'border-[#f0e8e0] focus:bg-white focus:border-[#D4537E]'
                } ${isScanning ? 'opacity-50' : ''}`} 
              />
              {isScanning && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 text-[#D4537E] animate-spin" />
                </div>
              )}
            </div>

            <h3 className="font-medium text-[#2C2C2A] flex items-center gap-2 mb-2">
              <UploadCloud className="w-4 h-4 text-gray-400" /> Upload payment proof
            </h3>
            <p className="text-xs text-gray-500 mb-4">Upload a screenshot of your receipt. Our system will auto-extract the reference number!</p>

            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-colors relative overflow-hidden ${
              isScanning ? 'border-[#D4537E] bg-[#FBEAF0]/30 cursor-wait' :
              fileName ? 'border-[#71A051] bg-[#EAF3DE]/30 cursor-pointer' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer'
            }`}>
              
              {/* Scanning laser overlay animation */}
              {isScanning && (
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                  <div className="w-full h-1 bg-[#D4537E] absolute top-0 animate-[scan_1.5s_ease-in-out_infinite]" style={{ boxShadow: '0 0 8px 2px rgba(212, 83, 126, 0.5)' }}></div>
                </div>
              )}

              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4 relative z-10">
                {isScanning ? (
                  <>
                    <ScanLine className="w-8 h-8 text-[#D4537E] mb-2 animate-pulse" />
                    <p className="text-sm font-bold text-[#D4537E]">AI is reading receipt...</p>
                    <p className="text-[10px] text-[#D4537E]/70 mt-1">This may take a few seconds</p>
                  </>
                ) : fileName ? (
                  <>
                    <CheckCircle2 className="w-8 h-8 text-[#71A051] mb-2" />
                    <p className="text-sm font-medium text-[#71A051] truncate w-full max-w-[200px]">{fileName}</p>
                    <p className="text-[10px] text-gray-500 mt-1 hover:underline">Click to change</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-600">Click to upload screenshot</p>
                    <p className="text-[10px] text-gray-400 mt-1">PNG or JPG</p>
                  </>
                )}
              </div>
              <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleFileUpload} disabled={isScanning} />
            </label>
            
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes scan {
                0% { top: 0%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
              }
            `}} />
            
          </div>

        </div>
      </div>

      <div className="mt-10 flex gap-4">
        <button 
          type="button" 
          onClick={() => router.push('/checkout/payment')}
          disabled={isSubmitting || isScanning}
          className="w-1/3 bg-white border border-[#f0e8e0] text-gray-700 py-4 rounded-full text-base font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button 
          onClick={handlePlaceOrder}
          disabled={!fileName || !referenceNo || isSubmitting || isScanning} 
          className={`w-2/3 py-4 rounded-full text-base font-medium shadow-sm transition-all duration-300 flex justify-center items-center gap-2 ${
            (fileName && referenceNo && !isSubmitting && !isScanning)
              ? 'bg-[#2C2C2A] text-white hover:bg-black cursor-pointer' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
          ) : (
            fileName && referenceNo ? 'Place Order' : 'Upload receipt to order'
          )}
        </button>
      </div>
    </div>
  );
}