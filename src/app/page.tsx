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
  // NEW: Pull the user state to check if they are logged in
  const { user } = useCheckoutStore();

  return (
    <div className="min-h-screen bg-[#fdf8f5] text-[#2C2C2A] font-sans selection:bg-[#D4537E] selection:text-white overflow-x-hidden">
      <style>{style}</style>

      {/* TOP NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 bg-[#fdf8f5]/80 backdrop-blur-md border-b border-[#f0e8e0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-medium tracking-tight">
            pup<span className="text-[#D4537E]">merch</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/catalog" className="text-sm font-medium text-gray-600 hover:text-[#D4537E] transition-colors">
              Catalog
            </Link>
            
            {/* NEW: Account Icon */}
            <Link href="/account" className="p-2 text-gray-600 hover:text-[#D4537E] transition-colors relative">
              <User className="w-5 h-5" />
              {user && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#71A051] rounded-full ring-2 ring-[#fdf8f5]"></span>}
            </Link>

            <Link href="/catalog" className="flex items-center gap-2 bg-[#2C2C2A] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black transition-all hover:scale-105 shadow-sm">
              <ShoppingBag className="w-4 h-4" /> Shop now
            </Link>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Background decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FBEAF0] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-[#EAF3DE] rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Text Content */}
          <div className="text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 bg-white border border-[#f0e8e0] px-3 py-1.5 rounded-full text-xs font-medium text-[#D4537E] shadow-sm mb-6">
              <Sparkles className="w-3.5 h-3.5" /> <span>The new College Editions are live</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-medium tracking-tight text-[#2C2C2A] leading-[1.1] mb-6">
              Crafting connections through <span className="text-[#D4537E] italic pr-2">unique</span> collectibles.
            </h1>
            <p className="text-gray-500 text-base lg:text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Upgrade your daily commute with premium, aesthetic transit card stickers. Rep your college, show your vibe, and protect your card.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/catalog" className="w-full sm:w-auto bg-[#D4537E] text-white px-8 py-4 rounded-full text-base font-medium shadow-md hover:bg-[#b8436b] hover:shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                Explore the catalog <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: 3D Floating Card */}
          <div className="perspective-container h-[400px] flex items-center justify-center z-10 hidden md:flex">
            <div className="sway-card w-[320px] aspect-[1.58/1] rounded-[20px] shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#D4537E] via-[#E47B9D] to-[#FBEAF0] border border-white/40 group">
              {/* Fake Chip */}
              <div className="absolute top-6 left-6 w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md border border-yellow-300 shadow-sm flex items-center justify-center opacity-90">
                <div className="w-8 h-6 border border-yellow-700/30 rounded-sm"></div>
              </div>
              {/* NFC Icon */}
              <SmartphoneNfc className="absolute top-7 right-6 w-7 h-7 text-white/80 rotate-90 drop-shadow-md" />
              
              {/* Aesthetic Brand Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                <span className="text-4xl font-bold tracking-tighter drop-shadow-md mix-blend-overlay opacity-50">polycrafted</span>
              </div>
              
              <div className="absolute bottom-5 left-6">
                <p className="text-white/90 text-sm font-medium tracking-wide shadow-black drop-shadow-md">Iskolar ng Bayan</p>
                <p className="text-white/70 text-[10px] uppercase tracking-widest mt-0.5">Premium Edition</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SCROLLING TICKER */}
      <div className="bg-[#2C2C2A] text-[#fdf8f5] py-3 overflow-hidden border-y border-[#2C2C2A]">
        <div className="whitespace-nowrap">
          <div className="animate-marquee text-sm font-medium tracking-wide">
            <span className="mx-4">✨ Premium Vinyl Matte</span>
            <span className="mx-4">•</span>
            <span className="mx-4">💧 Water & Scratch Resistant</span>
            <span className="mx-4">•</span>
            <span className="mx-4">⚡ NFC/RFID Safe</span>
            <span className="mx-4">•</span>
            <span className="mx-4">🎀 Leaves No Residue</span>
            <span className="mx-4">•</span>
            <span className="mx-4">🇵🇭 Proudly Student-Made</span>
            <span className="mx-4">•</span>
            {/* Repeat for seamless loop */}
            <span className="mx-4">✨ Premium Vinyl Matte</span>
            <span className="mx-4">•</span>
            <span className="mx-4">💧 Water & Scratch Resistant</span>
            <span className="mx-4">•</span>
            <span className="mx-4">⚡ NFC/RFID Safe</span>
            <span className="mx-4">•</span>
            <span className="mx-4">🎀 Leaves No Residue</span>
            <span className="mx-4">•</span>
            <span className="mx-4">🇵🇭 Proudly Student-Made</span>
          </div>
        </div>
      </div>

      {/* 3. BROWSE BY VIBE GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-medium text-[#2C2C2A] mb-3">Shop by vibe</h2>
          <p className="text-gray-500 text-sm">Find the perfect aesthetic for your daily commute.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1 */}
          <Link href="/catalog" className="group relative h-64 rounded-[32px] overflow-hidden bg-gradient-to-br from-red-400 to-amber-300 p-8 flex flex-col justify-end shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
            <div className="relative z-10">
              <span className="bg-white/90 backdrop-blur-md text-[#2C2C2A] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3 inline-block">University</span>
              <h3 className="text-2xl font-bold text-white drop-shadow-md">PUP Editions</h3>
            </div>
          </Link>

          {/* Card 2 */}
          <Link href="/catalog" className="group relative h-64 rounded-[32px] overflow-hidden bg-gradient-to-br from-fuchsia-300 to-purple-400 p-8 flex flex-col justify-end shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
            <div className="relative z-10">
              <span className="bg-white/90 backdrop-blur-md text-[#2C2C2A] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3 inline-block">Kawaii</span>
              <h3 className="text-2xl font-bold text-white drop-shadow-md">Sanrio Drops</h3>
            </div>
          </Link>

          {/* Card 3 */}
          <Link href="/catalog" className="group relative h-64 rounded-[32px] overflow-hidden bg-gradient-to-br from-[#FBEAF0] to-rose-200 p-8 flex flex-col justify-end shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
            <div className="relative z-10">
              <span className="bg-white/90 backdrop-blur-md text-[#D4537E] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3 inline-block">Aesthetic</span>
              <h3 className="text-2xl font-bold text-[#D4537E] drop-shadow-sm">Coquette Core</h3>
            </div>
          </Link>

          {/* Card 4 */}
          <Link href="/catalog" className="group relative h-64 rounded-[32px] overflow-hidden bg-gradient-to-br from-emerald-300 to-teal-400 p-8 flex flex-col justify-end shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
            <div className="relative z-10">
              <span className="bg-white/90 backdrop-blur-md text-[#2C2C2A] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3 inline-block">Exclusive</span>
              <h3 className="text-2xl font-bold text-white drop-shadow-md">College Departments</h3>
            </div>
          </Link>

        </div>
      </section>

      {/* 4. ABOUT US / MISSION */}
      <section className="bg-white py-24 border-t border-[#f0e8e0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-[#FBEAF0] rounded-full flex items-center justify-center mx-auto mb-6 text-[#D4537E]">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <h2 className="text-3xl font-medium text-[#2C2C2A] mb-8">Get to know us</h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
            Polycrafted is committed to crafting unique collectibles that not only foster a sense of pride in one's identity but also cultivate a sense of community. We operate with the belief that art has the transformative power to make the world a better place.
          </p>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-10">
            By creating items that people can connect with personally, Polycrafted aims to bring individuals together, celebrating diverse backgrounds and stories through the universal language of creativity.
          </p>
          <Link href="/catalog" className="inline-block bg-[#fdf8f5] border border-[#f0e8e0] text-[#2C2C2A] px-8 py-3 rounded-full text-sm font-medium hover:bg-[#FBEAF0] hover:border-[#D4537E] transition-colors">
            Support the movement
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#fdf8f5] py-12 border-t border-[#f0e8e0] text-center text-sm text-gray-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-medium text-[#2C2C2A] mb-2">pupmerch by Polycrafted © 2026</p>
          <p>Para sa Bayan. Crafted in Manila.</p>
        </div>
      </footer>
    </div>
  );
}