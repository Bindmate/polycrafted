"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, ChevronDown, Heart, Search, Plus, Star, Share, X, User, TicketPercent, CheckCircle2 } from "lucide-react";
import { useCheckoutStore } from "@/lib/store";

const VIBES = ["All drops", "Sanrio", "Coquette", "College editions", "University"];
type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'rating';

export default function CatalogPage() {
  const { addItem, items, getTotal, user, wishlist, toggleWishlist, products, fetchProducts } = useCheckoutStore();
  
  // FETCH FROM DATABASE ON LOAD!
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const [activeVibe, setActiveVibe] = useState("All drops");
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Lock scroll when cart is open on mobile
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isCartOpen]);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  // Determine current active unit price based on cart volume
  const activeUnitPrice = cartItemCount >= 2 ? 24 : 30;

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

  const handleQuickAdd = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id: product.id, name: product.name, price: product.price, quantity: 1 });
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

  const getBadgeStyle = (badge: string | null) => {
    if (badge === "Best seller") return "bg-[#FAEEDA] text-[#633806]";
    if (badge === "New drop") return "bg-[#EAF3DE] text-[#27500A]";
    if (badge === "Trending") return "bg-[#EEEDFE] text-[#3C3489]";
    return "";
  };

  return (
    <div className="min-h-screen bg-[#fdf8f5] text-gray-800 font-sans pb-24 relative overflow-x-hidden">
      
      {/* --- UPGRADED SLIDE-OUT CART DRAWER --- */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        />
      )}
      
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#fdf8f5] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-[#f0e8e0] bg-white">
          <h2 className="text-lg md:text-xl font-medium text-[#2C2C2A] flex items-center gap-2">
            My bag <span className="text-sm font-normal text-gray-500">({cartItemCount} items)</span>
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          
          {/* VOLUME PRICING PROGRESS BAR */}
          <div className="bg-white p-5 md:p-6 border-b border-[#f0e8e0] mb-4">
            {cartItemCount === 0 ? (
               <div>
                 <p className="text-sm font-bold text-[#D4537E] mb-1">Unlock Pair Pricing!</p>
                 <p className="text-xs text-gray-600">Buy any 2 stickers to drop the price to ₱24 each.</p>
               </div>
            ) : cartItemCount === 1 ? (
               <div>
                 <p className="text-sm font-bold text-[#D4537E] mb-1">You're almost there!</p>
                 <p className="text-xs text-gray-600 mb-3">Add 1 more sticker to save ₱12 on your order.</p>
                 <div className="w-full bg-[#f0e8e0] h-2 rounded-full overflow-hidden">
                   <div className="bg-[#D4537E] h-full w-1/2 transition-all duration-500"></div>
                 </div>
               </div>
            ) : (
               <div>
                 <p className="text-sm font-bold text-[#71A051] mb-1 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> Pair Promo Active!</p>
                 <p className="text-xs text-gray-600 mb-3">Awesome! All stickers are now only ₱24.00 each.</p>
                 <div className="w-full bg-[#f0e8e0] h-2 rounded-full overflow-hidden">
                   <div className="bg-[#71A051] h-full w-full transition-all duration-500"></div>
                 </div>
               </div>
            )}
          </div>

          <div className="px-5 md:px-6 pb-6">
            {items.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
                <ShoppingBag className="w-16 h-16 text-gray-300" />
                <p className="text-base">Your bag is empty.</p>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 text-[#D4537E] font-medium hover:underline text-sm"
                >
                  Continue browsing
                </button>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item, index) => {
                  // Find the actual product in the DB to grab its real image
                  const cartProduct = products.find(p => p.id === item.id);
                  
                  return (
                    <li key={`${item.id}-${index}`} className="flex gap-4 items-center bg-white p-3 rounded-[16px] border border-[#f0e8e0] shadow-sm">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden relative bg-gradient-to-br ${cartProduct?.color || 'from-gray-100 to-gray-200'}`}>
                        {cartProduct?.frontImage ? (
                          <img src={cartProduct.frontImage} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-gray-400 font-bold">{item.name.split(' ')[0]}</span>
                        )}
                      </div>
                      <div className="flex-1 py-1 pr-2">
                        <h4 className="text-sm font-bold text-[#2C2C2A] leading-tight mb-1 line-clamp-2">{item.name}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-100 px-2 py-1 rounded-md">
                            Qty: {item.quantity}
                          </span>
                          <div className="text-right">
                            <p className="text-sm font-bold text-[#D4537E]">
                              ₱{(activeUnitPrice * item.quantity).toFixed(2)}
                            </p>
                            {cartItemCount >= 2 && (
                              <p className="text-[10px] text-gray-400 line-through">
                                ₱{(30 * item.quantity).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {items.length > 0 && (
          <div className="p-5 md:p-6 border-t border-[#f0e8e0] bg-white mt-auto shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-5">
              <span className="text-base font-medium text-[#2C2C2A]">Subtotal</span>
              <span className="text-2xl font-bold text-[#2C2C2A]">₱{getTotal().toFixed(2)}</span>
            </div>
            <Link 
              href="/checkout/details"
              className="w-full flex justify-center items-center bg-[#D4537E] text-white py-3.5 md:py-4 rounded-full text-base font-medium hover:bg-[#b8436b] transition-colors shadow-sm"
            >
              Go to checkout
            </Link>
            <p className="text-[11px] text-center text-gray-500 mt-3 flex items-center justify-center gap-1">
              GCash & Maya accepted <span className="text-[#D4537E]">♥</span>
            </p>
          </div>
        )}
      </div>

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
        
        {/* SOFT HERO BANNER (RESTORED 3D CARDS) */}
        <div className="relative overflow-hidden rounded-[20px] md:rounded-[24px] bg-[#FBEAF0] p-6 sm:p-8 md:p-12 mb-6 md:mb-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 border border-[#f0e8e0]">
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <span className="inline-block py-1 px-3 rounded-full bg-white/60 text-[#D4537E] text-xs font-medium mb-3">Just dropped</span>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-medium text-[#2C2C2A] tracking-tight mb-3 md:mb-4">The Iskolar collection</h1>
            <p className="text-[#72243E]/80 text-sm md:text-base font-normal max-w-md mx-auto md:mx-0 mb-5 md:mb-0">
              Upgrade your daily commute with our newest aesthetic drops. Handcrafted for the modern student.
            </p>
          </div>
          
          {/* RESTORED: The stacked 3D cards */}
          <div className="relative w-48 h-48 hidden md:block">
            <div className="absolute top-4 right-0 w-32 h-44 bg-gradient-to-br from-pink-200 to-rose-300 rounded-[12px] shadow-sm rotate-12 border border-white/50"></div>
            <div className="absolute top-2 right-8 w-32 h-44 bg-gradient-to-br from-fuchsia-200 to-purple-200 rounded-[12px] shadow-md rotate-6 border border-white/50"></div>
            <div className="absolute top-0 right-16 w-32 h-44 bg-gradient-to-br from-[#fdf8f5] to-[#f0e8e0] rounded-[12px] shadow-lg border border-white flex items-center justify-center p-4 text-center">
            </div>
          </div>
        </div>

        {/* Promo Banner (Only shows if logged out) */}
        {!user && (
          <Link href="/account" className="block bg-gradient-to-r from-white to-[#fdf8f5] border border-[#f0e8e0] rounded-[16px] p-4 md:p-5 mb-6 md:mb-8 shadow-sm hover:border-[#D4537E]/40 transition-colors group relative overflow-hidden">
            <div className="flex items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#FBEAF0] text-[#D4537E] rounded-full flex items-center justify-center flex-shrink-0">
                  <TicketPercent className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="font-medium text-[#2C2C2A] text-sm md:text-base">Unlock 10% off your entire order</h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-0.5">Create a free student account to save your wishlists and get exclusive drops.</p>
                </div>
              </div>
              <span className="hidden xs:inline-flex bg-[#2C2C2A] text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs font-medium group-hover:bg-black transition-colors flex-shrink-0">Join the Community</span>
            </div>
          </Link>
        )}

        {/* BROWSE BY VIBE */}
        <div className="mb-6 md:mb-8">
          <p className="text-xs md:text-sm font-medium text-gray-500 mb-3 md:mb-4">Browse by vibe</p>
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
                  <div 
                    className={`aspect-[1.58/1] w-full bg-gradient-to-br ${product.color} relative flex items-center justify-center p-6 text-center select-none`}
                    style={{ backgroundImage: `url('${product.frontImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  >
                    {/* THE WATERMARK: Only on the product image! */}
                    <div className="absolute inset-0 flex items-center justify-center rotate-[-25deg] pointer-events-none z-0">
                      <span className="text-xl xs:text-2xl md:text-3xl font-black text-white/60 tracking-widest uppercase drop-shadow-md">
                        Polycrafted
                      </span>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 xs:top-3 xs:left-3 flex flex-col gap-1.5 items-start z-10">
                      {product.badge && (
                        <span className={`text-[9px] xs:text-[10px] uppercase tracking-wider font-semibold px-2 xs:px-2.5 py-1 rounded-full shadow-sm ${getBadgeStyle(product.badge)}`}>
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
                        title="Share design"
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
                       <div className="md:hidden absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-full text-[#D4537E]">
                           <Plus className="w-4 h-4" onClick={(e) => handleQuickAdd(product, e)}/>
                       </div>
                    </div>
                  </div>
                </Link>

                <div className="mt-3 flex flex-col px-1">
                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="flex text-[#D28E3D]">
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                    <span className="text-[11px] font-medium text-gray-600">{product.rating}</span>
                    <span className="text-[10px] text-gray-400">({product.reviews})</span>
                  </div>

                  <h3 className="text-xs xs:text-sm text-gray-800 font-medium leading-tight line-clamp-2 min-h-[32px] xs:min-h-[40px]">
                    <Link href={`/product/${product.id}`} className="hover:text-[#D4537E]">{product.name}</Link>
                  </h3>
                  
                  <div className="mt-2.5 xs:mt-3 mb-3 xs:mb-3.5">
                    <div className="flex justify-between items-end mb-1.5">
                      <span className={`text-[10px] xs:text-[11px] font-medium ${stockText}`}>{stockLabel}</span>
                    </div>
                    <div className="w-full bg-[#f0e8e0] h-1 xs:h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ease-out ${stockColor}`} style={{ width: `${stockPercentage}%` }}></div>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-base xs:text-lg font-bold text-[#2C2C2A]">₱{product.price.toFixed(2)}</p>
                    <span className="text-[10px] xs:text-[11px] bg-[#EAF3DE] text-[#27500A] px-2 py-0.5 rounded-md font-medium whitespace-nowrap">
                        ₱24 if you buy 2+
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {displayProducts.length === 0 && (
            <div className="text-center py-20 px-4 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-white/50 mt-10">
                <Search className="w-16 h-16 text-gray-300 mb-6" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">No designs found</h3>
                <p className="text-gray-500 max-w-sm mb-8 text-sm">We couldn't find any designs matching your current search or filter. Try adjusting them or browse all collections.</p>
                <button 
                    onClick={() => { setActiveVibe("All drops"); setSearchQuery(""); }}
                    className="bg-[#2C2C2A] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black transition-colors"
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