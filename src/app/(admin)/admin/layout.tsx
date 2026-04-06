"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCheckoutStore } from "@/lib/store";
import { 
  LayoutDashboard, ShoppingBag, Package, Users, CalendarDays, LogOut, Lock, ArrowRight
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdminAuthenticated, loginAdmin, logoutAdmin, adminOrders } = useCheckoutStore();
  
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(passcode)) {
      setError("");
    } else {
      setError("Incorrect passcode. Try 'polycrafted2026'");
      setPasscode("");
    }
  };

  if (!isMounted) return null;

  // --- THE SECURE LOCK SCREEN ---
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fdf8f5] flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-[24px] border border-[#f0e8e0] shadow-xl p-8 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-[#FBEAF0] rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-[#D4537E]" />
          </div>
          <h1 className="text-2xl font-bold text-center text-[#2C2C2A] mb-2">ERP Access Restricted</h1>
          <p className="text-center text-gray-500 text-sm mb-8">Please enter the admin passcode to access the business portal.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                placeholder="Enter Passcode" 
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className={`w-full bg-[#fdf8f5] border outline-none rounded-xl py-3 px-4 text-center tracking-widest font-mono transition-all ${
                  error ? 'border-red-300 focus:border-red-500 bg-red-50' : 'border-[#f0e8e0] focus:bg-white focus:border-[#D4537E]'
                }`}
              />
              {error && <p className="text-red-500 text-xs text-center mt-2 font-medium animate-in fade-in">{error}</p>}
            </div>
            <button type="submit" className="w-full bg-[#D4537E] text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-[#b8436b] transition-all flex justify-center items-center gap-2">
              Unlock Portal <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          
          <div className="mt-8 text-center border-t border-[#f0e8e0] pt-6">
            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-[#D4537E] transition-colors">
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Count pending orders for the notification badge
  const pendingOrdersCount = adminOrders.filter(o => o.status === "Awaiting Verification").length;

  // Added a strict TypeScript type here so it knows 'badge' is optional!
  type NavLink = {
    name: string;
    href: string;
    icon: any;
    badge?: number;
  };

  const navLinks: NavLink[] = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag, badge: pendingOrdersCount },
    { name: "Inventory", href: "/admin/inventory", icon: Package },
    // FIX: Updated href to match your singular "customer" folder!
    { name: "Customers", href: "/admin/customer", icon: Users }, 
    { name: "Schedule", href: "/admin/schedule", icon: CalendarDays },
  ];

  // --- THE SECURE ADMIN LAYOUT ---
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-20">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-bold tracking-tight text-[#2C2C2A]">
            pup<span className="text-[#D4537E]">merch</span> <span className="text-xs text-gray-400 font-medium ml-1">ERP</span>
          </span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? "bg-[#FBEAF0] text-[#D4537E]" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </div>
                {/* FIX: Safely check if badge exists and is greater than 0 */}
                {(link.badge || 0) > 0 && (
                  <span className="bg-[#D4537E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all mb-2">
            <LogOut className="w-5 h-5 rotate-180" /> Exit to Storefront
          </Link>
          <button onClick={logoutAdmin} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all">
            <Lock className="w-3.5 h-3.5" /> Lock ERP
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}