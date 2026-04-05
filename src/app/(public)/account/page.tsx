"use client";
import { useState } from "react";
import Link from "next/link";
import { useCheckoutStore } from "@/lib/store";
import { User, Heart, Sparkles, LogOut, TicketPercent, ArrowRight, Building, GraduationCap, CheckCircle2 } from "lucide-react";

export default function AccountPage() {
  const { user, login, logout, wishlist } = useCheckoutStore();
  
  const [isLogin, setIsLogin] = useState(false);
  
  // Form State
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [school, setSchool] = useState("");
  const [college, setCollege] = useState("");
  const [yearLevel, setYearLevel] = useState("");

  const handleMockAuth = (e: React.FormEvent) => {
    e.preventDefault();
    login({ 
      name: isLogin ? "Iskolar" : firstName, 
      email: email || "student@email.com", 
      school: school || "PUP Manila",
      college: college || "CBA",
      yearLevel: yearLevel || "Sophomore",
      isMember: true 
    });
  };

  // --- GUEST STATE (LOGIN / SIGNUP) ---
  if (!user) {
    return (
      <div className="min-h-screen bg-[#fdf8f5] flex items-center justify-center p-4 py-20">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white border border-[#f0e8e0] rounded-[32px] shadow-xl overflow-hidden">
          
          {/* Left Side: The Benefits Pitch */}
          <div className="bg-[#FBEAF0] p-10 flex flex-col justify-center">
            <Sparkles className="w-10 h-10 text-[#D4537E] mb-6" />
            <h2 className="text-3xl font-medium text-[#2C2C2A] mb-4 tracking-tight">Join the Community</h2>
            <p className="text-[#72243E]/80 text-sm mb-8 leading-relaxed">
              Create an account to unlock exclusive perks tailored for your college journey.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D4537E] flex-shrink-0" />
                <span className="text-sm font-medium text-[#2C2C2A]">Permanent 10% OFF all orders</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D4537E] flex-shrink-0" />
                <span className="text-sm font-medium text-[#2C2C2A]">Save items to your Wishlist</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D4537E] flex-shrink-0" />
                <span className="text-sm font-medium text-[#2C2C2A]">Early access to your college's drops</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D4537E] flex-shrink-0" />
                <span className="text-sm font-medium text-[#2C2C2A]">Personalized promos and updates</span>
              </li>
            </ul>
          </div>

          {/* Right Side: The Form */}
          <div className="p-10 flex flex-col justify-center">
            <h1 className="text-2xl font-medium text-[#2C2C2A] mb-6">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>

            <form onSubmit={handleMockAuth} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Nickname</label>
                    <input required type="text" placeholder="How should we call you?" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] outline-none rounded-2xl py-3 px-4 text-sm transition-all" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">School / University</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input required type="text" placeholder="e.g. PUP Manila" value={school} onChange={(e) => setSchool(e.target.value)} className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] outline-none rounded-2xl py-3 pl-9 pr-4 text-sm transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">College / Department</label>
                      <input required type="text" placeholder="e.g. CCIS or Marketing" value={college} onChange={(e) => setCollege(e.target.value)} className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] outline-none rounded-2xl py-3 px-4 text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Year Level</label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select required value={yearLevel} onChange={(e) => setYearLevel(e.target.value)} className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] outline-none rounded-2xl py-3 pl-9 pr-4 text-sm transition-all appearance-none cursor-pointer">
                          <option value="" disabled>Select...</option>
                          <option value="Freshman">Freshman</option>
                          <option value="Sophomore">Sophomore</option>
                          <option value="Junior">Junior</option>
                          <option value="Senior">Senior</option>
                          <option value="Alumni">Alumni</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Email</label>
                <input required type="email" placeholder="student@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] outline-none rounded-2xl py-3 px-4 text-sm transition-all" />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Password</label>
                <input required type="password" placeholder="••••••••" className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] outline-none rounded-2xl py-3 px-4 text-sm transition-all" />
              </div>

              <button type="submit" className="w-full bg-[#D4537E] text-white py-3.5 rounded-full text-base font-medium shadow-sm hover:bg-[#b8436b] transition-colors mt-2">
                {isLogin ? 'Log In' : 'Create Account'}
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-500">{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
              <button onClick={() => setIsLogin(!isLogin)} className="text-[#D4537E] font-medium ml-1 hover:underline">
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </div>
            <div className="mt-4 text-center">
              <Link href="/catalog" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Continue as guest
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LOGGED IN STATE ---
  return (
    <div className="min-h-screen bg-[#fdf8f5] text-[#2C2C2A] font-sans pb-24 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-medium tracking-tight mb-1">Welcome back, {user.name}!</h1>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              <Building className="w-3.5 h-3.5" /> {user.school} • {user.college} • <GraduationCap className="w-3.5 h-3.5" /> {user.yearLevel}
            </p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors bg-white border border-[#f0e8e0] px-4 py-2 rounded-full">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-[#D4537E] to-[#E47B9D] rounded-[24px] p-6 text-white shadow-lg relative overflow-hidden">
              <Sparkles className="absolute top-4 right-4 w-12 h-12 text-white/20" />
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                <TicketPercent className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-1">Iskolar VIP</h3>
              <p className="text-white/80 text-sm mb-4">Your 10% member discount is active and applies automatically at checkout.</p>
              <Link href="/catalog" className="inline-block bg-white text-[#D4537E] text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-sm hover:scale-105 transition-transform">
                Shop now
              </Link>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white border border-[#f0e8e0] rounded-[24px] p-6 sm:p-8 shadow-sm min-h-[300px]">
              <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#D4537E] fill-[#D4537E]" /> Your Wishlist ({wishlist.length})
              </h2>
              {wishlist.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[#fdf8f5] rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <Heart className="w-8 h-8" />
                  </div>
                  <p className="text-gray-500 text-sm mb-4">You haven't saved any aesthetics yet.</p>
                  <Link href="/catalog" className="inline-flex items-center gap-2 text-[#D4537E] font-medium hover:underline text-sm">
                    Explore designs <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {wishlist.map(id => (
                    <div key={id} className="flex items-center justify-between p-4 rounded-xl border border-[#f0e8e0] hover:border-[#D4537E]/30 transition-colors">
                      <p className="font-medium text-[#2C2C2A]">Product ID: {id}</p>
                      <Link href={`/product/${id}`} className="text-sm text-[#D4537E] hover:underline">View</Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}