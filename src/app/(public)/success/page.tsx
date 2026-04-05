"use client";
import Link from "next/link";
import { Sparkles, PackageCheck, MessageCircle } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f5] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-[#f0e8e0] rounded-[32px] p-8 md:p-12 text-center shadow-xl animate-in fade-in zoom-in-95 duration-500">
        
        {/* Animated Icon */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-[#FBEAF0] rounded-full animate-ping opacity-70"></div>
          <div className="relative bg-[#D4537E] w-24 h-24 rounded-full flex items-center justify-center shadow-md">
            <PackageCheck className="w-10 h-10 text-white" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-bounce" />
        </div>

        <h1 className="text-3xl font-medium text-[#2C2C2A] tracking-tight mb-3">
          Order secured!
        </h1>
        
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          We've received your order and payment proof. Your aesthetic haul is now being prepared!
        </p>

        {/* Reminder Box */}
        <div className="bg-[#fdf8f5] border border-[#f0e8e0] rounded-[16px] p-5 text-left mb-8">
          <h3 className="font-medium text-[#2C2C2A] text-sm mb-2">One last step:</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Please message our Facebook page right now to confirm your order and so we can send you your exact shipping fee updates!
          </p>
        </div>

        <div className="space-y-3">
          {/* External Link to Polycrafted Facebook */}
          <a 
            href="https://www.facebook.com/profile.php?id=61565346441145"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full bg-[#2C2C2A] text-white py-4 rounded-full text-sm font-medium shadow-sm hover:bg-black transition-colors"
          >
            <MessageCircle className="w-4 h-4 mr-2" /> Message Polycrafted
          </a>
          
          <Link 
            href="/catalog"
            className="flex items-center justify-center w-full bg-white border border-[#f0e8e0] text-gray-600 py-4 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Back to catalog
          </Link>
        </div>

      </div>
    </div>
  );
}