"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { 
  ShoppingBag, 
  ChevronDown, 
  Heart, 
  Search, 
  Plus, 
  Star, 
  Share, 
  X, 
  User, 
  CheckCircle2, 
  Minus, 
  Trash2, 
  Sparkles, 
  TicketPercent, 
  Layers 
} from "lucide-react";
import { useCheckoutStore } from "@/lib/store";

const VIBES = ["All drops", "Sanrio", "Coquette", "College editions", "University"];
type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'rating';

export default function CatalogPage() {
  const router = useRouter();
  
  const { 
    addItem, 
    items, 
    getTotal, 
    user, 
    wishlist, 
    toggleWishlist, 
    products, 
    fetchProducts, 
    updateQuantity, 
    removeItem 
  } = useCheckoutStore();
  
  useEffect(() => {
    fetchProducts();
    router.refresh(); 
  }, [fetchProducts, router]);

  const [activeVibe, setActiveVibe] = useState("All drops");
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isCartOpen]);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  // Savings Math using the new 30/43/67 logic
  const baseTotal = cartItemCount * 30;
  const bundleTotal = cartItemCount === 0 ? 0 : cartItemCount === 1 ? 30 : 43 + ((cartItemCount - 2) * 24);
  const totalSavings = baseTotal - bundleTotal;

  const upsellProducts = products
    .filter(p => !items.some(i => i.id.replace('-front','').replace('-back','') === p.id))
    .slice(0, 4);

  const handleShare = (productName: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: `Polycrafted - ${productName}`,
        text: `Check out this design from Polycrafted!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert(`Link to ${productName} copied! Ready to share via Messenger/Viber.`);
    }
  };

  const handleQuickAdd = (product: any, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    // If it's a back-to-back design, force them to the product page so they can pick front/back/pair!
    if (product.backImage) {
      router.push(`/product/${product.id}`);
      return;
    }

    addItem({ 
      id: product.id, 
      name: product.name, 
      price: 30, 
      quantity: 1 
    });
    setIsCartOpen(true);
  };

  const displayProducts = useMemo(() => {
    let filtered = products.filter(p => {
      const matchesVibe = activeVibe === "All drops" || p.category === activeVibe;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesVibe && matchesSearch;
    });

    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    
    return filtered;
  }, [activeVibe, sortBy, searchQuery, products]);

  // Added the custom Back-to-Back styling here so we don't need duplicate badges
  const getBadgeStyle = (badge: string | null) => {
    if (badge === "Best seller") return "bg-[#FAEEDA] text-[#633806]";
    if (badge === "New drop") return "bg-[#EAF3DE] text-[#27500A]";
    if (badge === "Trending") return "bg-[#EEEDFE] text-[#3C3489]";
    if (badge === "Back-to-Back") return "bg-indigo-50/90 text-indigo-700 border border-indigo-100 backdrop-blur-sm";
    return "bg-white text-gray-800";
  };

  return (
    <div className="min-h-screen bg-[#fdf8f5] text-gray-800 font-sans pb-24 relative overflow-x-hidden">
      
      {/* --- CENTERED CART MODAL --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          
          <div className="bg-[#fdf8f5] w-full max-w-2xl max-h-[90vh] rounded-[24px] shadow-2xl flex flex-col overflow-hidden relative z-10 animate-in zoom-in-95 duration-200 border border-[#f0e8e0]">
            
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-[#f0e8e0] bg-white">
              <h2 className="text-lg md:text-xl font-bold text-[#2C2C2A] flex items-center gap-2">
                My Bag <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{cartItemCount}</span>
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-5 md:p-6 border-b border-[#f0e8e0] bg-white">
                {cartItemCount === 0 ? (
                  <div className="bg-[#FBEAF0] border border-[#D4537E]/20 p-4 rounded-xl flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#D4537E] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-[#D4537E] mb-1">Unlock Volume Pricing!</p>
                      <p className="text-xs text-gray-600">Buy 2 pieces for ₱43. Every succeeding piece is only ₱24!</p>
                    </div>
                  </div>
                ) : cartItemCount === 1 ? (
                  <div className="bg-[#FBEAF0] border border-[#D4537E]/20 p-4 rounded-xl">
                    <p className="text-sm font-bold text-[#D4537E] mb-1">You're almost there!</p>
                    <p className="text-xs text-gray-600 mb-3">Add 1 more piece to unlock the ₱43 Pair Price!</p>
                    <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#D4537E]/20">
                      <div className="bg-[#D4537E] h-full w-1/2 transition-all duration-500"></div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#EAF3DE] border border-[#71A051]/20 p-4 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#71A051] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-[#71A051] mb-1">Volume Promo Active!</p>
                      <p className="text-xs text-[#27500A]">Awesome! You're saving <strong>₱{totalSavings.toFixed(2)}</strong> on your items.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 md:p-6 bg-white">
                {items.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center text-gray-500">
                    <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
                    <p className="text-base font-medium">Your bag is empty.</p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {items.map((item, index) => {
                      const baseId = item.id.replace('-front', '').replace('-back', '');
                      const cartProduct = products.find(p => p.id === baseId);
                      
                      return (
                        <li key={`${item.id}-${index}`} className="flex gap-4 items-center bg-white p-3 md:p-4 rounded-[20px] border border-[#f0e8e0] shadow-sm">
                          <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-[14px] flex-shrink-0 flex items-center justify-center overflow-hidden relative bg-gradient-to-br ${cartProduct?.color || 'from-gray-100 to-gray-200'}`}>
                            {cartProduct?.frontImage ? (
                              <img 
                                src={item.id.includes('-back') && cartProduct.backImage ? cartProduct.backImage : cartProduct.frontImage} 
                                className="w-full h-full object-cover" 
                                alt={item.name}
                              />
                            ) : (
                              <span className="text-xs text-gray-400 font-bold">{item.name.split(' ')[0]}</span>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center rotate-[-25deg] pointer-events-none">
                              <span className="text-[10px] font-bold text-white/50 tracking-widest uppercase">Polycrafted</span>
                            </div>
                          </div>
                          
                          <div className="flex-1 flex flex-col justify-between py-1 pr-2">
                            <div>
                              <div className="flex justify-between items-start">
                                <div>
                                  {cartProduct && <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">{cartProduct.category}</span>}
                                  <h4 className="text-sm md:text-base font-bold text-[#2C2C2A] leading-tight line-clamp-1">{item.name}</h4>
                                </div>
                                <button 
                                  onClick={() => removeItem(item.id)} 
                                  className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex items-end justify-between mt-3">
                              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full h-8 px-1">
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                                  className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-xs font-bold text-[#2C2C2A]">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                                  className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              
                              <div className="text-right">
                                {cartItemCount >= 2 && (
                                  <p className="text-[10px] text-gray-400 line-through mb-0.5">₱{(30 * item.quantity).toFixed(2)}</p>
                                )}
                                <p className="text-sm md:text-base font-black text-[#D4537E]">
                                  ₱{(30 * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {items.length > 0 && upsellProducts.length > 0 && (
                <div className="p-5 md:p-6 bg-[#fdf8f5] border-t border-[#f0e8e0]">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">You might also like (Add for just ₱30)</p>
                  <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
                    {upsellProducts.map(upsell => (
                      <div key={upsell.id} className="flex-shrink-0 w-28 group cursor-pointer" onClick={(e) => handleQuickAdd(upsell, e)}>
                        <div className={`w-full aspect-[1.58/1] rounded-xl relative overflow-hidden bg-gradient-to-br ${upsell.color} border border-gray-200 mb-2`}>
                          {upsell.frontImage && <img src={upsell.frontImage} className="w-full h-full object-cover" />}
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Plus className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <p className="text-[10px] font-medium text-gray-700 truncate">{upsell.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 md:p-6 border-t border-[#f0e8e0] bg-white mt-auto">
                {totalSavings > 0 && (
                  <div className="flex justify-between items-center mb-3 text-sm">
                    <span className="text-[#71A051] font-bold flex items-center gap-1">
                      <TicketPercent className="w-4 h-4"/> Bundle Savings
                    </span>
                    <span className="text-[#71A051] font-bold">-₱{totalSavings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center mb-4 pt-3 border-t border-[#f0e8e0]">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Subtotal</span>
                  <span className="text-2xl font-black text-[#2C2C2A]">₱{getTotal().toFixed(2)}</span>
                </div>
                <Link 
                  href="/checkout/details"
                  className="w-full flex justify-center items-center bg-[#D4537E] text-white py-4 rounded-full text-base font-bold hover:bg-[#b8436b] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  onClick={() => setIsCartOpen(false)}
                >
                  Proceed to Checkout
                </Link>
                
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded flex items-center gap-1 border border-blue-100">GCASH</span>
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded flex items-center gap-1 border border-green-100">MAYA</span>
                  <span className="px-2 py-1 bg-gray-50 text-gray-700 text-[10px] font-bold rounded flex items-center gap-1 border border-gray-200">COD</span>
                  <span className="px-2 py-1 bg-gray-50 text-gray-700 text-[10px] font-bold rounded flex items-center gap-1 border border-gray-200">BANK</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STICKY TOP NAVIGATION */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#f0e8e0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
          <Link href="/" className="text-xl md:text-2xl font-medium tracking-tight flex-shrink-0">
            pup<span className="text-[#D4537E]">merch</span>
          </Link>

          <div className="hidden sm:block relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search designs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] outline-none rounded-full py-2.5 md:py-3 pl-10 pr-4 text-sm font-medium transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
            <button className="sm:hidden p-2 text-gray-600 hover:text-[#D4537E]">
                <Search className="w-5 h-5" />
            </button>
            <Link href="/account" className="p-2 text-gray-600 hover:text-[#D4537E] transition-colors relative">
              <User className="w-5 h-5" />
              {user && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#71A051] rounded-full ring-2 ring-white"></span>}
            </Link>
            <Link href="/account" className="p-2 text-gray-600 hover:text-[#D4537E] transition-colors relative">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#D4537E] rounded-full text-[7px] text-white flex items-center justify-center font-bold">
                    {wishlist.length}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-[#2C2C2A] text-white px-3.5 py-2 md:px-5 md:py-3 rounded-full text-sm font-medium hover:bg-black transition-colors"
            >
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden xs:inline">My bag</span>
              {cartItemCount > 0 && (
                <span className="bg-white text-[#2C2C2A] text-xs font-semibold px-2 py-0.5 rounded-full ml-0.5 md:ml-1">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10">
        
        {/* ISKOLAR LIFE LOGIN BANNER */}
        {!user ? (
          <div className="bg-[#FBEAF0] rounded-[24px] p-6 md:p-10 mb-8 border border-[#f0e8e0] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="relative z-10 max-w-lg text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2A] tracking-tight mb-2">iskolar life</h2>
              <p className="text-gray-700 text-sm md:text-base mb-6 leading-relaxed">Create a free student account to unlock exclusive perks and manage your aesthetic haul.</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
                <span className="bg-white/80 backdrop-blur-sm border border-white text-[#D4537E] px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold shadow-sm">10% Off Orders</span>
                <span className="bg-white/80 backdrop-blur-sm border border-white text-gray-700 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold shadow-sm">Save Wishlists</span>
                <span className="bg-white/80 backdrop-blur-sm border border-white text-gray-700 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold shadow-sm">Early Drops</span>
                <span className="bg-white/80 backdrop-blur-sm border border-white text-gray-700 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold shadow-sm">Personalized Promo</span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 w-full sm:w-auto">
                <Link href="/account" className="w-full sm:w-auto bg-[#D4537E] text-white px-6 py-3 rounded-full text-sm font-bold shadow-md hover:bg-[#b8436b] transition-all hover:-translate-y-0.5 text-center">
                  Create free account
                </Link>
                <Link href="/account" className="w-full sm:w-auto bg-white/80 backdrop-blur-sm text-[#2C2C2A] border border-white px-6 py-3 rounded-full text-sm font-bold hover:bg-white transition-all text-center shadow-sm">
                  Log in
                </Link>
              </div>
            </div>
            
            <div className="relative w-48 h-48 hidden md:block flex-shrink-0">
              <div className="absolute top-8 right-0 w-32 h-44 bg-gradient-to-br from-pink-300 to-rose-400 rounded-[14px] shadow-lg rotate-12 border-4 border-white flex flex-col justify-end p-3">
                 <div className="w-full h-2 bg-white/30 rounded-full mb-1"></div>
                 <div className="w-2/3 h-2 bg-white/30 rounded-full"></div>
              </div>
              <div className="absolute top-0 right-12 w-32 h-44 bg-gradient-to-br from-indigo-300 to-purple-400 rounded-[14px] shadow-xl -rotate-6 border-4 border-white flex items-center justify-center">
                 <div className="w-12 h-12 bg-white/30 rounded-full"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-[20px] md:rounded-[24px] bg-[#FBEAF0] p-6 sm:p-8 md:p-12 mb-6 md:mb-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 border border-[#f0e8e0]">
            <div className="relative z-10 max-w-xl text-center md:text-left">
              <span className="inline-block py-1 px-3 rounded-full bg-white/60 text-[#D4537E] text-xs font-medium mb-3">Welcome back, {user.name.split(' ')[0]}</span>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-medium text-[#2C2C2A] tracking-tight mb-3 md:mb-4">The Iskolar collection</h1>
              <p className="text-[#72243E]/80 text-sm md:text-base font-normal max-w-md mx-auto md:mx-0 mb-5 md:mb-0">
                Upgrade your daily commute with our newest aesthetic drops. 10% VIP discount applied at checkout.
              </p>
            </div>
            <div className="relative w-48 h-48 hidden md:block flex-shrink-0">
              <div className="absolute top-8 right-0 w-32 h-44 bg-gradient-to-br from-pink-300 to-rose-400 rounded-[14px] shadow-lg rotate-12 border-4 border-white flex flex-col justify-end p-3">
                 <div className="w-full h-2 bg-white/30 rounded-full mb-1"></div>
                 <div className="w-2/3 h-2 bg-white/30 rounded-full"></div>
              </div>
              <div className="absolute top-0 right-12 w-32 h-44 bg-gradient-to-br from-indigo-300 to-purple-400 rounded-[14px] shadow-xl -rotate-6 border-4 border-white flex items-center justify-center">
                 <div className="w-12 h-12 bg-white/30 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {/* BROWSE BY VIBE */}
        <div className="mb-6 md:mb-8 mt-4">
          <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 md:mb-4">Browse by vibe</p>
          <div className="flex overflow-x-auto gap-2.5 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar snap-x">
            {VIBES.map((vibe, i) => {
              const pastelBgs = ['bg-[#fdf8f5]', 'bg-[#FBEAF0]', 'bg-[#EEEDFE]', 'bg-[#EAF3DE]', 'bg-[#FAEEDA]'];
              const inactiveBg = pastelBgs[i % pastelBgs.length];
              return (
                <button
                  key={vibe}
                  onClick={() => setActiveVibe(vibe)}
                  className={`whitespace-nowrap px-4 py-2 md:px-5 md:py-2.5 rounded-full text-sm transition-all snap-start border ${
                    activeVibe === vibe 
                      ? "bg-[#2C2C2A] border-[#2C2C2A] text-white font-medium shadow-sm" 
                      : `${inactiveBg} border-[#f0e8e0] text-gray-600 hover:border-gray-300 font-normal`
                  }`}
                >
                  {vibe}
                </button>
              );
            })}
          </div>
        </div>

        {/* TOOLBAR ROW */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#f0e8e0] gap-4">
          <p className="text-xs md:text-sm font-normal text-gray-500">{displayProducts.length} items found</p>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-transparent text-gray-700 text-xs md:text-sm font-medium pr-6 focus:outline-none cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Top rated</option>
                <option value="price-asc">Lowest price</option>
                <option value="price-desc">Highest price</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid gap-x-4 gap-y-8 xs:gap-x-5 xs:gap-y-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {displayProducts.map((product) => {
            const isSaved = wishlist.includes(product.id);
            const stockPercentage = Math.min((product.stock / product.maxStock) * 100, 100);
            
            let stockColor = "bg-[#71A051]"; 
            let stockText = "text-[#71A051]";
            let stockLabel = "In stock";
            
            if (product.stock <= 5) {
              stockColor = "bg-[#D4537E]"; 
              stockText = "text-[#D4537E]";
              stockLabel = "Last few!";
            } else if (product.stock <= 10) {
              stockColor = "bg-[#D28E3D]"; 
              stockText = "text-[#D28E3D]";
              stockLabel = "Almost gone";
            }

            return (
              <div key={product.id} className="group relative flex flex-col animate-in fade-in duration-300">
                
                <Link href={`/product/${product.id}`} className="block relative overflow-hidden rounded-[16px] md:rounded-[18px] bg-white border border-[#f0e8e0] shadow-sm transition-all duration-300 group-hover:border-[#D4537E]/30">
                  <div className={`aspect-[1.58/1] w-full bg-gradient-to-br ${product.color} relative select-none`}>
                    
                    {/* NEW: SMOOTH CROSSFADE HOVER ANIMATION */}
                    <div 
                      className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out ${product.backImage ? 'group-hover:opacity-0' : ''}`}
                      style={{ backgroundImage: `url('${product.frontImage}')` }}
                    />
                    
                    {product.backImage && (
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100"
                        style={{ backgroundImage: `url('${product.backImage}')` }}
                      />
                    )}

                    <div className="absolute inset-0 flex items-center justify-center rotate-[-25deg] pointer-events-none z-0">
                      <span className="text-xl xs:text-2xl md:text-3xl font-black text-white/60 tracking-widest uppercase drop-shadow-md">
                        Polycrafted
                      </span>
                    </div>

                    <div className="absolute top-2 left-2 xs:top-3 xs:left-3 flex flex-col gap-1.5 items-start z-10">
                      {product.badge && (
                        <span className={`text-[9px] xs:text-[10px] uppercase tracking-wider font-bold px-2 xs:px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 ${getBadgeStyle(product.badge)}`}>
                          {product.badge === "Back-to-Back" && <Layers className="w-3 h-3" />}
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2 right-2 xs:top-3 xs:right-3 z-20 flex flex-col gap-1.5 xs:gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => {
                          e.preventDefault(); 
                          toggleWishlist(product.id);
                        }}
                        className={`p-1.5 xs:p-2 rounded-full backdrop-blur-md transition-all ${
                          isSaved ? 'bg-white shadow-sm' : 'bg-white/50 hover:bg-white/80'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 xs:w-4 xs:h-4 transition-colors ${isSaved ? 'fill-[#D4537E] text-[#D4537E]' : 'text-gray-700'}`} />
                      </button>
                      <button 
                        onClick={(e) => handleShare(product.name, e)}
                        className="p-1.5 xs:p-2 rounded-full bg-white/50 backdrop-blur-md hover:bg-white/80 transition-all hidden xs:flex"
                      >
                        <Share className="w-3.5 h-3.5 xs:w-3.5 xs:h-3.5 text-gray-700" />
                      </button>
                    </div>

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end md:items-center justify-center p-3 xs:p-4">
                      <div className="w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hidden md:block">
                        <button 
                          onClick={(e) => handleQuickAdd(product, e)}
                          className="w-full flex justify-center items-center gap-2 bg-white text-[#2C2C2A] py-2.5 rounded-full text-sm font-semibold shadow-lg hover:bg-[#fdf8f5] transition-colors"
                        >
                          <Plus className="w-4 h-4 text-[#D4537E]" /> Add to bag
                        </button>
                      </div>
                       <div className="md:hidden absolute bottom-2 right-2 bg-white/90 shadow-sm p-2 rounded-full text-[#D4537E]">
                           <Plus className="w-4 h-4" onClick={(e) => handleQuickAdd(product, e)}/>
                       </div>
                    </div>
                  </div>
                </Link>

                <div className="mt-3 flex flex-col px-1">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{product.category}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#D28E3D] fill-current" />
                      <span className="text-[11px] font-bold text-gray-600">{product.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-xs xs:text-sm text-gray-800 font-bold leading-tight line-clamp-2 min-h-[32px] xs:min-h-[40px]">
                    <Link href={`/product/${product.id}`} className="hover:text-[#D4537E]">{product.name}</Link>
                  </h3>
                  
                  <div className="mt-1 mb-2 xs:mb-3">
                    <div className="flex justify-between items-end mb-1">
                      <span className={`text-[10px] font-bold ${stockText}`}>{stockLabel}</span>
                    </div>
                    <div className="w-full bg-[#f0e8e0] h-1 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ease-out ${stockColor}`} style={{ width: `${stockPercentage}%` }}></div>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-base xs:text-lg font-black text-[#D4537E]">₱30.00</p>
                    {product.backImage ? (
                      <span className="text-[10px] bg-[#FBEAF0] text-[#D4537E] px-2 py-0.5 rounded-md font-bold whitespace-nowrap">
                          ₱43 pair
                      </span>
                    ) : (
                      <span className="text-[10px] bg-[#FBEAF0] text-[#D4537E] px-2 py-0.5 rounded-md font-bold whitespace-nowrap">
                          Volume discount
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {displayProducts.length === 0 && (
            <div className="text-center py-20 px-4 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-white/50 mt-10">
                <Search className="w-16 h-16 text-gray-300 mb-6" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No designs found</h3>
                <p className="text-gray-500 max-w-sm mb-8 text-sm">We couldn't find any designs matching your current search or filter. Try adjusting them or browse all collections.</p>
                <button 
                    onClick={() => { setActiveVibe("All drops"); setSearchQuery(""); }}
                    className="bg-[#2C2C2A] text-white px-6 py-3 rounded-full text-sm font-bold shadow-sm hover:bg-black transition-colors"
                >
                    Clear filters & search
                </button>
            </div>
        )}
      </div>
      
      <div className="h-safe-bottom"></div>
    </div>
  );
}