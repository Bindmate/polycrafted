"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, ChevronDown, Heart, Search, Plus, Star, Share, X, User, TicketPercent } from "lucide-react";
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

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleShare = (productName: string, e: React.MouseEvent) => {
    e.preventDefault();
    alert(`Link to ${productName} copied! Ready to share via Messenger/Viber.`);
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
    <div className="min-h-screen bg-[#fdf8f5] text-gray-800 font-sans pb-24 relative">
      
      {/* --- SLIDE-OUT CART DRAWER --- */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 transition-opacity backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        />
      )}
      
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
        isCartOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-[#f0e8e0]">
          <h2 className="text-xl font-medium text-[#2C2C2A] flex items-center gap-2">
            My bag <span className="text-sm font-normal text-gray-500">({cartItemCount} items)</span>
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
              <p>Your bag is empty.</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-4 text-[#D4537E] font-medium hover:underline"
              >
                Continue browsing
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item, index) => (
                <li key={`${item.id}-${index}`} className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#f0e8e0] to-gray-200 border border-gray-100 flex-shrink-0 flex items-center justify-center text-[10px] text-gray-400 uppercase font-bold text-center p-2">
                    {item.name.split(' ')[0]}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-[#2C2C2A] line-clamp-2">{item.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-[#2C2C2A] mt-1">₱{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-[#f0e8e0] bg-[#fdf8f5]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-base font-medium text-[#2C2C2A]">Subtotal</span>
              <span className="text-xl font-medium text-[#2C2C2A]">₱{getTotal().toFixed(2)}</span>
            </div>
            <Link 
              href="/checkout/details"
              className="w-full flex justify-center items-center bg-[#D4537E] text-white py-3.5 rounded-full text-base font-medium hover:bg-[#b8436b] transition-colors shadow-sm"
            >
              Go to checkout
            </Link>
            <p className="text-xs text-center text-gray-500 mt-3 flex items-center justify-center gap-1">
              GCash & Maya accepted <span className="text-[#D4537E]">♥</span>
            </p>
          </div>
        )}
      </div>

      {/* STICKY TOP NAVIGATION */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#f0e8e0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="text-xl font-medium tracking-tight">
            pup<span className="text-[#D4537E]">merch</span>
          </Link>

          <div className="hidden sm:block relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search designs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#fdf8f5] border border-[#f0e8e0] focus:bg-white focus:border-[#D4537E] outline-none rounded-full py-2 pl-9 pr-4 text-sm font-medium transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <Link href="/account" className="p-2 text-gray-600 hover:text-[#D4537E] transition-colors relative">
              <User className="w-5 h-5" />
              {user && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#71A051] rounded-full ring-2 ring-white"></span>}
            </Link>

            <Link href="/account" className="p-2 text-gray-600 hover:text-[#D4537E] transition-colors relative">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D4537E] rounded-full"></span>
              )}
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-[#2C2C2A] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>My bag</span>
              {cartItemCount > 0 && (
                <span className="bg-white text-[#2C2C2A] text-xs font-medium px-1.5 py-0.5 rounded-full ml-1">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* SOFT HERO BANNER */}
        <div className="relative overflow-hidden rounded-[24px] bg-[#FBEAF0] p-8 md:p-12 mb-6 flex flex-col md:flex-row items-center justify-between gap-8 border border-[#f0e8e0]">
          <div className="relative z-10 max-w-xl">
            <span className="inline-block py-1 px-3 rounded-full bg-white/60 text-[#D4537E] text-xs font-medium mb-3">Just dropped</span>
            <h1 className="text-3xl md:text-5xl font-medium text-[#2C2C2A] tracking-tight mb-3">The Iskolar collection</h1>
            <p className="text-[#72243E]/80 text-sm md:text-base font-normal max-w-md mb-6">
              Upgrade your daily commute with our newest aesthetic drops. Handcrafted for the modern student.
            </p>
          </div>
        </div>

        {/* Promo Banner (Only shows if logged out) */}
        {!user && (
          <Link href="/account" className="block bg-gradient-to-r from-white to-[#fdf8f5] border border-[#f0e8e0] rounded-[16px] p-4 mb-8 shadow-sm hover:border-[#D4537E]/40 transition-colors group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FBEAF0] text-[#D4537E] rounded-full flex items-center justify-center">
                  <TicketPercent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-[#2C2C2A] text-sm">Unlock 10% off your entire order</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Create a free student account to save your wishlists and get exclusive drops.</p>
                </div>
              </div>
              <span className="hidden sm:inline-flex bg-[#2C2C2A] text-white px-4 py-2 rounded-full text-xs font-medium group-hover:bg-black transition-colors">Join the Community</span>
            </div>
          </Link>
        )}

        {/* BROWSE BY VIBE */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-500 mb-3">Browse by vibe</p>
          <div className="flex overflow-x-auto gap-2.5 pb-2 no-scrollbar snap-x">
            {VIBES.map((vibe, i) => {
              const pastelBgs = ['bg-[#fdf8f5]', 'bg-[#FBEAF0]', 'bg-[#EEEDFE]', 'bg-[#EAF3DE]', 'bg-[#FAEEDA]'];
              const inactiveBg = pastelBgs[i % pastelBgs.length];
              return (
                <button
                  key={vibe}
                  onClick={() => setActiveVibe(vibe)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-sm transition-all snap-start border ${
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
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#f0e8e0]">
          <p className="text-sm font-normal text-gray-500">{displayProducts.length} items found</p>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-transparent text-gray-700 text-sm font-medium pr-6 focus:outline-none cursor-pointer"
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
        <div className={`grid gap-x-5 gap-y-10 grid-cols-2`}>
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
              <div key={product.id} className="group relative flex flex-col">
                
                <Link href={`/product/${product.id}`} className="block relative overflow-hidden rounded-[18px] bg-white border border-[#f0e8e0] shadow-sm transition-all duration-300 group-hover:border-[#D4537E]/30">
                  <div 
                    className={`aspect-[1.58/1] w-full bg-gradient-to-br ${product.color} relative flex items-center justify-center p-6 text-center`}
                    style={{ backgroundImage: `url('${product.imagePath}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  >
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
                      {product.badge && (
                        <span className={`text-[10px] uppercase tracking-wider font-medium px-2.5 py-1 rounded-full shadow-sm ${getBadgeStyle(product.badge)}`}>
                          {product.badge}
                        </span>
                      )}
                      {product.isBundleEligible && (
                        <span className="text-[10px] bg-white/80 backdrop-blur-sm text-[#D4537E] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shadow-sm">
                          Bundle & Save
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
                      <button 
                        onClick={(e) => {
                          e.preventDefault(); 
                          toggleWishlist(product.id);
                        }}
                        className={`p-2 rounded-full backdrop-blur-md transition-all ${
                          isSaved ? 'bg-white shadow-sm' : 'bg-white/40 hover:bg-white/70'
                        }`}
                      >
                        <Heart className={`w-4 h-4 transition-colors ${isSaved ? 'fill-[#D4537E] text-[#D4537E]' : 'text-gray-600'}`} />
                      </button>
                      <button 
                        onClick={(e) => handleShare(product.name, e)}
                        className="p-2 rounded-full bg-white/40 backdrop-blur-md hover:bg-white/70 transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                        title="Share with batchmates"
                      >
                        <Share className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                    </div>

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end">
                      <div className="w-full p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button 
                          onClick={(e) => handleQuickAdd(product, e)}
                          className="w-full flex justify-center items-center gap-2 bg-white text-[#2C2C2A] py-2.5 rounded-full text-sm font-medium shadow-lg hover:bg-[#fdf8f5] transition-colors"
                        >
                          <Plus className="w-4 h-4 text-[#D4537E]" /> Add to bag
                        </button>
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

                  <h3 className="text-sm text-gray-800 font-medium leading-tight">
                    <Link href={`/product/${product.id}`}>{product.name}</Link>
                  </h3>
                  
                  <div className="mt-2.5">
                    <div className="flex justify-between items-end mb-1.5">
                      <span className={`text-[11px] font-medium ${stockText}`}>{stockLabel}</span>
                    </div>
                    <div className="w-full bg-[#f0e8e0] h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ease-out ${stockColor}`} style={{ width: `${stockPercentage}%` }}></div>
                    </div>
                  </div>

                  <div className="mt-3.5 flex items-center gap-2">
                    <p className="text-base font-medium text-[#2C2C2A]">₱{product.price.toFixed(2)}</p>
                    {product.originalPrice > product.price && (
                      <p className="text-xs font-normal text-gray-400 line-through">₱{product.originalPrice.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}