"use client";
import Link from "next/link";
import { ArrowRight, Sparkles, Heart, ShieldCheck, Droplets, SmartphoneNfc, ShoppingBag, User } from "lucide-react";
import { useCheckoutStore } from "@/lib/store";

// Reusing our awesome 3D animation for the hero section, plus a marquee animation
const style = `
  @keyframes sway {
    0% { transform: rotateY(-15deg) rotateX(5deg) translateY(0px); }
    50% { transform: rotateY(15deg) rotateX(-5deg) translateY(-10px); }
    100% { transform: rotateY(-5deg) rotateX(10deg) translateY(0px); }
  }
  @keyframes marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }
  .perspective-container { perspective: 1000px; }
  .sway-card {
    animation: sway 8s ease-in-out infinite alternate;
    transform-style: preserve-3d;
  }
  .animate-marquee {
    display: inline-block;
    white-space: nowrap;
    animation: marquee 20s linear infinite;
  }
`;

export default function HomePage() {
  const { user } = useCheckoutStore();

  return (
    <div className="min-h-screen bg-[#fdf8f5] text-[#2C2C2A] font-sans selection:bg-[#D4537E] selection:text-white overflow-x-hidden">
      <style>{style}</style>

      {/* TOP NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 bg-[#fdf8f5]/80 backdrop-blur-md border-b border-[#f0e8e0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-medium tracking-tight">
            pup<span className="text-[#D4537E]">merch</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/catalog" className="hidden xs:block text-sm font-medium text-gray-600 hover:text-[#D4537E] transition-colors">
              Catalog
            </Link>
            
            <Link href="/account" className="p-2 text-gray-600 hover:text-[#D4537E] transition-colors relative">
              <User className="w-5 h-5" />
              {user && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#71A051] rounded-full ring-2 ring-[#fdf8f5]"></span>}
            </Link>

            <Link href="/catalog" className="flex items-center gap-2 bg-[#2C2C2A] text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-black transition-all hover:scale-105 shadow-sm">
              <ShoppingBag className="w-4 h-4" /> <span className="hidden xs:inline">Shop now</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-28 overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Background decorative blobs */}
        <div className="absolute top-10 left-0 sm:top-20 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-[#FBEAF0] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-0 sm:right-20 w-48 h-48 sm:w-72 sm:h-72 bg-[#EAF3DE] rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

        <div className="relative flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 sm:gap-12 items-center mt-6 lg:mt-0">
          
          {/* Text Content */}
          <div className="text-center lg:text-left z-10 w-full">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white border border-[#f0e8e0] px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium text-[#D4537E] shadow-sm mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span>The new College Editions are live</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-[#2C2C2A] leading-[1.15] sm:leading-[1.1] mb-4 sm:mb-6">
              Crafting connections through <span className="text-[#D4537E] italic pr-1 sm:pr-2">unique</span> collectibles.
            </h1>
            
            <p className="text-gray-500 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-sm sm:max-w-lg mx-auto lg:mx-0 leading-relaxed px-2 sm:px-0">
              Upgrade your daily commute with premium, aesthetic transit card stickers. Rep your college, show your vibe, and protect your card.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/catalog" className="w-full sm:w-auto bg-[#D4537E] text-white px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-medium shadow-md hover:bg-[#b8436b] hover:shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                Explore the catalog <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* 3D Floating Card (Now visible on mobile too!) */}
          <div className="perspective-container h-[250px] sm:h-[300px] md:h-[400px] w-full flex items-center justify-center z-10 mt-4 sm:mt-0">
            <div className="sway-card w-[240px] sm:w-[280px] md:w-[320px] aspect-[1.58/1] rounded-[16px] sm:rounded-[20px] shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#D4537E] via-[#E47B9D] to-[#FBEAF0] border border-white/40 group">
              {/* Fake Chip */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-9 h-7 sm:w-12 sm:h-10 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded sm:rounded-md border border-yellow-300 shadow-sm flex items-center justify-center opacity-90">
                <div className="w-6 h-4 sm:w-8 sm:h-6 border border-yellow-700/30 rounded-[2px] sm:rounded-sm"></div>
              </div>
              {/* NFC Icon */}
              <SmartphoneNfc className="absolute top-5 right-4 sm:top-7 sm:right-6 w-5 h-5 sm:w-7 sm:h-7 text-white/80 rotate-90 drop-shadow-md" />
              
              {/* Aesthetic Brand Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 sm:p-6 text-center">
                <span className="text-3xl sm:text-4xl font-bold tracking-tighter drop-shadow-md mix-blend-overlay opacity-50">polycrafted</span>
              </div>
              
              <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-6">
                <p className="text-white/90 text-xs sm:text-sm font-medium tracking-wide shadow-black drop-shadow-md">Iskolar ng Bayan</p>
                <p className="text-white/70 text-[8px] sm:text-[10px] uppercase tracking-widest mt-0.5">Premium Edition</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SCROLLING TICKER */}
      <div className="bg-[#2C2C2A] text-[#fdf8f5] py-2.5 sm:py-3 overflow-hidden border-y border-[#2C2C2A]">
        <div className="whitespace-nowrap">
          <div className="animate-marquee text-xs sm:text-sm font-medium tracking-wide">
            <span className="mx-3 sm:mx-4">✨ Premium Vinyl Matte</span>
            <span className="mx-3 sm:mx-4">•</span>
            <span className="mx-3 sm:mx-4">💧 Water & Scratch Resistant</span>
            <span className="mx-3 sm:mx-4">•</span>
            <span className="mx-3 sm:mx-4">⚡ NFC/RFID Safe</span>
            <span className="mx-3 sm:mx-4">•</span>
            <span className="mx-3 sm:mx-4">🎀 Leaves No Residue</span>
            <span className="mx-3 sm:mx-4">•</span>
            <span className="mx-3 sm:mx-4">🇵🇭 Proudly Student-Made</span>
            <span className="mx-3 sm:mx-4">•</span>
            {/* Repeat for seamless loop */}
            <span className="mx-3 sm:mx-4">✨ Premium Vinyl Matte</span>
            <span className="mx-3 sm:mx-4">•</span>
            <span className="mx-3 sm:mx-4">💧 Water & Scratch Resistant</span>
            <span className="mx-3 sm:mx-4">•</span>
            <span className="mx-3 sm:mx-4">⚡ NFC/RFID Safe</span>
            <span className="mx-3 sm:mx-4">•</span>
            <span className="mx-3 sm:mx-4">🎀 Leaves No Residue</span>
            <span className="mx-3 sm:mx-4">•</span>
            <span className="mx-3 sm:mx-4">🇵🇭 Proudly Student-Made</span>
          </div>
        </div>
      </div>

      {/* 3. BROWSE BY VIBE GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h2 className="text-2xl sm:text-3xl font-medium text-[#2C2C2A] mb-2 sm:mb-3">Shop by vibe</h2>
          <p className="text-gray-500 text-xs sm:text-sm">Find the perfect aesthetic for your daily commute.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Card 1 */}
          <Link href="/catalog" className="group relative h-48 sm:h-56 md:h-64 rounded-[24px] sm:rounded-[32px] overflow-hidden bg-gradient-to-br from-red-400 to-amber-300 p-6 sm:p-8 flex flex-col justify-end shadow-sm hover:shadow-xl transition-all sm:hover:-translate-y-1">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
            <div className="relative z-10">
              <span className="bg-white/90 backdrop-blur-md text-[#2C2C2A] text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full mb-2 sm:mb-3 inline-block">University</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">PUP Editions</h3>
            </div>
          </Link>

          {/* Card 2 */}
          <Link href="/catalog" className="group relative h-48 sm:h-56 md:h-64 rounded-[24px] sm:rounded-[32px] overflow-hidden bg-gradient-to-br from-fuchsia-300 to-purple-400 p-6 sm:p-8 flex flex-col justify-end shadow-sm hover:shadow-xl transition-all sm:hover:-translate-y-1">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
            <div className="relative z-10">
              <span className="bg-white/90 backdrop-blur-md text-[#2C2C2A] text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full mb-2 sm:mb-3 inline-block">Kawaii</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">Sanrio Drops</h3>
            </div>
          </Link>

          {/* Card 3 */}
          <Link href="/catalog" className="group relative h-48 sm:h-56 md:h-64 rounded-[24px] sm:rounded-[32px] overflow-hidden bg-gradient-to-br from-[#FBEAF0] to-rose-200 p-6 sm:p-8 flex flex-col justify-end shadow-sm hover:shadow-xl transition-all sm:hover:-translate-y-1">
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
            <div className="relative z-10">
              <span className="bg-white/90 backdrop-blur-md text-[#D4537E] text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full mb-2 sm:mb-3 inline-block">Aesthetic</span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#D4537E] drop-shadow-sm">Coquette Core</h3>
            </div>
          </Link>

          {/* Card 4 */}
          <Link href="/catalog" className="group relative h-48 sm:h-56 md:h-64 rounded-[24px] sm:rounded-[32px] overflow-hidden bg-gradient-to-br from-emerald-300 to-teal-400 p-6 sm:p-8 flex flex-col justify-end shadow-sm hover:shadow-xl transition-all sm:hover:-translate-y-1">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
            <div className="relative z-10">
              <span className="bg-white/90 backdrop-blur-md text-[#2C2C2A] text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full mb-2 sm:mb-3 inline-block">Exclusive</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">College Departments</h3>
            </div>
          </Link>

        </div>
      </section>

      {/* 4. ABOUT US / MISSION */}
      <section className="bg-white py-16 sm:py-24 border-t border-[#f0e8e0]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#FBEAF0] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-[#D4537E]">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium text-[#2C2C2A] mb-6 sm:mb-8">Get to know us</h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed mb-5 sm:mb-6">
            Polycrafted is committed to crafting unique collectibles that not only foster a sense of pride in one's identity but also cultivate a sense of community. We operate with the belief that art has the transformative power to make the world a better place.
          </p>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed mb-8 sm:mb-10">
            By creating items that people can connect with personally, Polycrafted aims to bring individuals together, celebrating diverse backgrounds and stories through the universal language of creativity.
          </p>
          <Link href="/catalog" className="inline-block bg-[#fdf8f5] border border-[#f0e8e0] text-[#2C2C2A] px-6 py-2.5 sm:px-8 sm:py-3 rounded-full text-xs sm:text-sm font-medium hover:bg-[#FBEAF0] hover:border-[#D4537E] transition-colors">
            Support the movement
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#fdf8f5] py-8 sm:py-12 border-t border-[#f0e8e0] text-center text-xs sm:text-sm text-gray-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-medium text-[#2C2C2A] mb-1 sm:mb-2">pupmerch by Polycrafted © 2026</p>
          <p>Para sa Bayan. Crafted in Manila.</p>
        </div>
      </footer>
    </div>
  );
}