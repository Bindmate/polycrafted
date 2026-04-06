"use client";
import { useState, use, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingBag, Heart, ChevronRight, Star, Plus, Minus, 
  CheckCircle2, Copy, Camera, Smartphone, Droplets, ShieldCheck, 
  LayoutGrid, X, Layers, TicketPercent, Trash2 
} from "lucide-react";
import { useCheckoutStore } from "@/lib/store";

const style = `
  @keyframes spin-card {
    0% { transform: rotateY(0deg) rotateX(4deg); }
    50% { transform: rotateY(180deg) rotateX(-2deg); }
    100% { transform: rotateY(360deg) rotateX(4deg); }
  }
  .perspective-container { perspective: 1200px; }
  .spin-wrapper { animation: spin-card 12s linear infinite; transform-style: preserve-3d; width: 90%; height: 100%; position: relative; }
  @media (min-width: 768px) { .spin-wrapper { width: 85%; } }
  .spin-wrapper:hover { animation-play-state: paused; }
  .card-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; overflow: hidden; }
  .card-back { transform: rotateY(180deg); }
  .card-depth::before { content: ''; position: absolute; inset: -1px; background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%); border-radius: 20px; z-index: -1; transform: translateZ(-1px); }
`;

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { addItem, items, getTotal, products, wishlist, toggleWishlist, removeItem, updateQuantity } = useCheckoutStore();
  
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [previewBackId, setPreviewBackId] = useState<string | null>(null);

  const product = products.find((p) => p.id === resolvedParams.id);
  const [variant, setVariant] = useState(product?.backImage ? 'pair' : 'solo');

  useEffect(() => {
    if (product && !product.backImage) {
      const bagProducts = items.map(cartItem => products.find(p => p.id === cartItem.id.replace('-front','').replace('-back',''))).filter(Boolean);
      const possibleBack = bagProducts.find(p => p?.id !== product.id);
      if (possibleBack && !previewBackId) setPreviewBackId(possibleBack.id);
    }
  }, [items, product, products, previewBackId]);

  if (!product) return <div className="min-h-screen flex items-center justify-center bg-[#fdf8f5]">Design not found.</div>;

  const isSaved = wishlist.includes(product.id);
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const baseTotal = cartItemCount * 30;
  const bundleTotal = cartItemCount === 0 ? 0 : cartItemCount === 1 ? 30 : 43 + ((cartItemCount - 2) * 24);
  const totalSavings = baseTotal - bundleTotal;

  const previewProduct = previewBackId ? products.find(p => p.id === previewBackId) : null;
  const displayBackImage = product.backImage || previewProduct?.frontImage || null;

  const bagProducts = Array.from(new Set(items.map(item => item.id.replace('-front','').replace('-back',''))))
    .map(id => products.find(p => p.id === id)).filter(Boolean) as any[];

  const handleAddToCart = () => {
    if (variant === 'pair') {
      addItem({ id: `${product.id}-front`, name: `${product.name} (Front)`, price: 30, quantity: quantity });
      addItem({ id: `${product.id}-back`, name: `${product.name} (Back)`, price: 30, quantity: quantity });
    } else if (variant === 'front') {
      addItem({ id: `${product.id}-front`, name: `${product.name} (Front)`, price: 30, quantity: quantity });
    } else if (variant === 'back') {
      addItem({ id: `${product.id}-back`, name: `${product.name} (Back)`, price: 30, quantity: quantity });
    } else {
      addItem({ id: product.id, name: product.name, price: 30, quantity: quantity });
    }
    setIsCartOpen(true);
  };

  const handleAddUpsellToCart = (upsellProduct: any) => {
    addItem({ id: upsellProduct.id, name: upsellProduct.name, price: 30, quantity: 1 });
    setPreviewBackId(upsellProduct.id); 
  };

  return (
    <div className="min-h-screen bg-[#fdf8f5] text-[#2C2C2A] font-sans pb-24 relative overflow-x-hidden">
      <style>{style}</style>

      {isCartOpen && <div className="fixed inset-0 bg-black/40 z-50 transition-opacity backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />}
      
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-6 border-b border-[#f0e8e0]">
          <h2 className="text-xl font-medium text-[#2C2C2A] flex items-center gap-2">
            My bag <span className="text-sm font-normal text-gray-500">({cartItemCount} pieces)</span>
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="bg-[#FBEAF0]/50 p-6 border-b border-[#f0e8e0]">
            {cartItemCount === 0 ? (
               <div>
                 <p className="text-sm font-bold text-[#D4537E] mb-1">Unlock Volume Pricing!</p>
                 <p className="text-xs text-gray-600">Buy 2 pieces for ₱43. Every succeeding piece is only ₱24!</p>
               </div>
            ) : cartItemCount === 1 ? (
               <div>
                 <p className="text-sm font-bold text-[#D4537E] mb-1">You're almost there!</p>
                 <p className="text-xs text-gray-600 mb-3">Add 1 more piece to unlock the ₱43 Pair Price!</p>
                 <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#f0e8e0]">
                   <div className="bg-[#D4537E] h-full w-1/2 transition-all duration-500"></div>
                 </div>
               </div>
            ) : (
               <div>
                 <p className="text-sm font-bold text-[#71A051] mb-1 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> Volume Promo Active!</p>
                 <p className="text-xs text-gray-600 mb-3">Awesome! You're saving <strong>₱{totalSavings.toFixed(2)}</strong> on your items.</p>
                 <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#f0e8e0]">
                   <div className="bg-[#71A051] h-full w-full transition-all duration-500"></div>
                 </div>
               </div>
            )}
          </div>

          <div className="p-6">
            {items.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
                <ShoppingBag className="w-12 h-12 text-gray-300" />
                <p>Your bag is empty.</p>
              </div>
            ) : (
              <ul className="space-y-6">
                {items.map((item, index) => {
                  const baseId = item.id.replace('-front', '').replace('-back', '');
                  const cartProduct = products.find(p => p.id === baseId);
                  return (
                    <li key={`${item.id}-${index}`} className="flex gap-4">
                      <div className={`w-16 h-16 rounded-xl border border-gray-100 flex-shrink-0 overflow-hidden relative bg-gradient-to-br ${cartProduct?.color || 'from-gray-100 to-gray-200'}`}>
                         {cartProduct?.frontImage && <img src={item.id.includes('-back') && cartProduct.backImage ? cartProduct.backImage : cartProduct.frontImage} className="w-full h-full object-cover" alt={item.name} />}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold text-[#2C2C2A] leading-tight line-clamp-2 pr-4">{item.name}</h4>
                          <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <div className="flex items-end justify-between mt-2">
                          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full h-7 px-1">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-gray-500"><Minus className="w-3 h-3" /></button>
                            <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-gray-500"><Plus className="w-3 h-3" /></button>
                          </div>
                          <p className="text-sm font-bold text-gray-500">₱{(30 * item.quantity).toFixed(2)}</p>
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
          <div className="p-6 border-t border-[#f0e8e0] bg-[#fdf8f5]">
            {totalSavings > 0 && (
              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="text-[#71A051] font-bold flex items-center gap-1"><TicketPercent className="w-4 h-4"/> Bundle Savings</span>
                <span className="text-[#71A051] font-bold">-₱{totalSavings.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center mb-6 pt-3 border-t border-[#f0e8e0]">
              <span className="text-base font-medium text-[#2C2C2A]">Subtotal</span>
              <span className="text-2xl font-bold text-[#2C2C2A]">₱{getTotal().toFixed(2)}</span>
            </div>
            <Link href="/checkout/details" className="w-full flex justify-center items-center bg-[#D4537E] text-white py-3.5 rounded-full text-base font-medium hover:bg-[#b8436b] transition-colors shadow-sm" onClick={() => setIsCartOpen(false)}>
              Proceed to checkout
            </Link>
          </div>
        )}
      </div>

      {/* TOP NAV */}
      <nav className="sticky top-0 z-40 bg-[#fdf8f5]/90 backdrop-blur-md border-b border-[#f0e8e0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center text-sm font-medium text-gray-500 overflow-hidden whitespace-nowrap">
            <Link href="/" className="hover:text-[#D4537E] transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-1 opacity-50 flex-shrink-0" />
            <Link href="/catalog" className="hover:text-[#D4537E] transition-colors hidden sm:block">Catalog</Link>
            <ChevronRight className="w-4 h-4 mx-1 opacity-50 hidden sm:block flex-shrink-0" />
            <span className="text-[#2C2C2A] truncate max-w-[120px] sm:max-w-none">{product.category}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <button onClick={() => toggleWishlist(product.id)} className="text-gray-600 hover:text-[#D4537E] transition-colors relative p-2">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-[#D4537E] rounded-full"></span>}
            </button>
            <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-2 bg-white border border-[#f0e8e0] px-3 py-1.5 rounded-full text-sm font-medium shadow-sm hover:border-gray-300 transition-all">
              <ShoppingBag className="w-4 h-4" />
              {cartItemCount > 0 && <span className="bg-[#2C2C2A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cartItemCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          <div className="flex flex-col items-center">
            <div className="perspective-container w-full max-w-md aspect-[1.58/1] relative flex justify-center items-center py-4 sm:py-8">
              <div className="spin-wrapper">
                <div className={`card-face card-depth shadow-2xl bg-gradient-to-br ${product.color}`}>
                  <div className="absolute inset-0 w-full h-full bg-cover bg-center z-0" style={{ backgroundImage: `url('${product.frontImage}')` }} />
                </div>
                <div className="card-face card-back card-depth shadow-2xl bg-gray-100">
                  {displayBackImage ? (
                    <div className="absolute inset-0 w-full h-full bg-cover bg-center z-0" style={{ backgroundImage: `url('${displayBackImage}')` }} />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-gray-200 flex flex-col items-center justify-center border-4 border-gray-300 border-dashed rounded-[20px] p-6 text-center">
                      <Layers className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mb-2 sm:mb-3" />
                      <p className="text-gray-500 font-bold text-sm sm:text-base">Blank Backing</p>
                      <p className="text-gray-400 text-[10px] sm:text-xs mt-1 px-4 hidden sm:block">Add items to bag to preview them together!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-[10px] sm:text-xs text-gray-400 font-medium mt-4 text-center">Hold touch or hover to pause spin</p>

            {!product.backImage && bagProducts.length > 0 && (
              <div className="w-full max-w-xs mt-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">Preview back with bag items</p>
                <div className="flex overflow-x-auto gap-2 pb-2 px-2 no-scrollbar snap-x justify-center">
                  <button onClick={() => setPreviewBackId(null)} className={`flex-shrink-0 w-12 h-8 rounded-md border-2 overflow-hidden transition-all ${!previewBackId ? 'border-[#D4537E]' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[8px] text-gray-400 font-bold">BLANK</div>
                  </button>
                  {bagProducts.map(bp => (
                    <button key={bp.id} onClick={() => setPreviewBackId(bp.id)} className={`flex-shrink-0 w-12 h-8 rounded-md border-2 overflow-hidden transition-all ${previewBackId === bp.id ? 'border-[#D4537E]' : 'border-transparent hover:border-gray-300 shadow-sm'}`}>
                      <img src={bp.frontImage} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mt-8 text-xs sm:text-sm font-medium text-gray-500">
              <span className="hidden sm:inline">Share design:</span>
              <button className="flex items-center gap-1.5 bg-white border border-[#f0e8e0] px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"><Copy className="w-3.5 h-3.5" /> Copy</button>
              <button className="flex items-center gap-1.5 bg-white border border-[#f0e8e0] px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors text-pink-600"><Camera className="w-3.5 h-3.5" /> IG</button>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
              <span className="bg-[#EEEDFE] text-[#3C3489] text-[10px] sm:text-[11px] font-medium uppercase tracking-wider px-2 sm:px-2.5 py-1 rounded-full">{product.category}</span>
              {product.backImage && <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-1 rounded-full"><Layers className="w-3 h-3"/> Back-to-Back Set</span>}
              <span className="bg-[#EAF3DE] text-[#27500A] text-[10px] sm:text-[11px] font-medium uppercase tracking-wider px-2 sm:px-2.5 py-1 rounded-full">NFC-safe</span>
            </div>

            <h1 className="text-xl sm:text-[22px] font-medium text-[#2C2C2A] mb-2 sm:mb-3 leading-snug">{product.name}</h1>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4 whitespace-pre-wrap">{product.description || "A premium, water-resistant vinyl sticker designed to elevate your daily commute. Leaves no residue and fits perfectly on standard cards."}</p>

            <div className="flex items-center gap-1.5 mb-6">
              <div className="flex text-[#D28E3D]">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /><Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /><Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /><Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /><Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 ml-1">4.0</span>
            </div>

            {/* DYNAMIC VARIANT SELECTOR */}
            {product.backImage ? (
              <div className="mb-6">
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Format</p>
                <div className="grid grid-cols-1 gap-2 mb-2">
                  <button onClick={() => setVariant('pair')} className={`flex justify-between items-center px-4 py-3 rounded-xl border-2 transition-all ${variant === 'pair' ? 'border-[#D4537E] bg-[#FBEAF0]/50 shadow-sm' : 'border-[#f0e8e0] hover:border-gray-300'}`}>
                    <div className="flex flex-col items-start">
                      <span className={`text-sm font-bold ${variant === 'pair' ? 'text-[#D4537E]' : 'text-gray-700'}`}>Complete Set (Front & Back)</span>
                      <span className="text-xs text-gray-500 font-medium">2 stickers included</span>
                    </div>
                    <span className={`font-bold text-lg ${variant === 'pair' ? 'text-[#D4537E]' : 'text-gray-700'}`}>₱43.00</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setVariant('front')} className={`flex justify-between items-center px-4 py-3 rounded-xl border-2 transition-all ${variant === 'front' ? 'border-[#D4537E] bg-[#FBEAF0]/50' : 'border-[#f0e8e0] hover:border-gray-300'}`}>
                    <span className={`text-sm font-bold ${variant === 'front' ? 'text-[#D4537E]' : 'text-gray-700'}`}>Front Only</span>
                    <span className={`font-bold ${variant === 'front' ? 'text-[#D4537E]' : 'text-gray-500'}`}>₱30.00</span>
                  </button>
                  <button onClick={() => setVariant('back')} className={`flex justify-between items-center px-4 py-3 rounded-xl border-2 transition-all ${variant === 'back' ? 'border-[#D4537E] bg-[#FBEAF0]/50' : 'border-[#f0e8e0] hover:border-gray-300'}`}>
                    <span className={`text-sm font-bold ${variant === 'back' ? 'text-[#D4537E]' : 'text-gray-700'}`}>Back Only</span>
                    <span className={`font-bold ${variant === 'back' ? 'text-[#D4537E]' : 'text-gray-500'}`}>₱30.00</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#fdf8f5] border border-[#f0e8e0] rounded-xl p-4 sm:p-5 mb-6">
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pricing</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-bold text-[#2C2C2A]">₱30.00</span>
                      <span className="text-xs sm:text-sm text-gray-500 font-medium">/ solo piece</span>
                    </div>
                  </div>
                  <div className="bg-[#EAF3DE] text-[#27500A] px-3 py-2 rounded-lg text-[10px] sm:text-xs font-bold shadow-sm w-fit">
                    Pairs start at ₱43.00
                  </div>
                </div>
              </div>
            )}

            {!product.backImage && (
              <div className="bg-[#FBEAF0]/50 border border-[#D4537E]/30 rounded-xl p-4 sm:p-5 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4537E]" />
                    <h3 className="text-sm sm:text-base font-bold text-[#D4537E]">Complete your pair!</h3>
                  </div>
                  <span className="bg-[#D4537E] text-white text-[8px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">SAVE ₱17</span>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-600 mb-4 leading-relaxed">You selected a Front design. Add any Back design below to complete your Beep card and unlock the ₱43 pair promo.</p>
                
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {products.filter(p => p.id !== product.id && !p.backImage).slice(0, 3).map((upsell) => (
                    <div key={upsell.id} className="text-center group cursor-pointer" onClick={() => handleAddUpsellToCart(upsell)}>
                      <div className={`aspect-[1.58/1] w-full bg-gradient-to-br ${upsell.color} rounded-lg border border-[#f0e8e0] mb-2 overflow-hidden relative shadow-sm group-hover:shadow-md transition-all`}>
                        {upsell.frontImage && <img src={upsell.frontImage} className="w-full h-full object-cover" />}
                        <div className="absolute inset-0 bg-[#D4537E]/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                          <span className="text-white text-[10px] sm:text-xs font-bold flex items-center gap-1"><Plus className="w-3 h-3"/> Add Back</span>
                        </div>
                      </div>
                      <p className="text-[8px] sm:text-[10px] font-medium text-gray-700 truncate px-1">{upsell.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mb-6">
              <span className={`w-2 h-2 rounded-full animate-pulse ${product.stock <= 5 ? 'bg-red-500' : 'bg-[#D28E3D]'}`}></span>
              <span className={`text-xs sm:text-sm font-medium ${product.stock <= 5 ? 'text-red-500' : 'text-[#D28E3D]'}`}>
                {product.stock <= 5 ? `Almost gone! Only ${product.stock} left` : `Only ${product.stock} left in stock — order soon`}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8">
              <div className="flex items-center bg-white border border-[#f0e8e0] rounded-full h-12 sm:h-14 px-1 sm:px-2 shadow-sm">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 hover:text-black"><Minus className="w-3 h-3 sm:w-4 sm:h-4" /></button>
                <span className="w-6 sm:w-8 text-center text-sm font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 hover:text-black"><Plus className="w-3 h-3 sm:w-4 sm:h-4" /></button>
              </div>
              
              <button onClick={handleAddToCart} className="flex-1 bg-[#D4537E] text-white h-12 sm:h-14 rounded-full text-sm sm:text-base font-bold shadow-md hover:bg-[#b8436b] transition-all transform hover:scale-[1.02]">
                Add to bag
              </button>
            </div>

            <ul className="space-y-2 sm:space-y-3 mb-8">
              <li className="flex items-start gap-2 sm:gap-3"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#71A051] flex-shrink-0 mt-0.5" /><span className="text-xs sm:text-sm text-gray-600 font-medium">Water-resistant & scratch-proof matte finish</span></li>
              <li className="flex items-start gap-2 sm:gap-3"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#71A051] flex-shrink-0 mt-0.5" /><span className="text-xs sm:text-sm text-gray-600 font-medium">Leaves no residue when removed</span></li>
              <li className="flex items-start gap-2 sm:gap-3"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#71A051] flex-shrink-0 mt-0.5" /><span className="text-xs sm:text-sm text-gray-600 font-medium">Standard Beep card dimensions</span></li>
              <li className="flex items-start gap-2 sm:gap-3"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#71A051] flex-shrink-0 mt-0.5" /><span className="text-xs sm:text-sm text-gray-600 font-medium">NFC signal passes through normally</span></li>
            </ul>

            <div className="pt-4 sm:pt-6 border-t border-[#f0e8e0]">
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium mb-3">Secure payments accepted</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <span className="bg-blue-50 text-blue-700 text-[9px] sm:text-[11px] font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-blue-100">GCash</span>
                <span className="bg-green-50 text-green-700 text-[9px] sm:text-[11px] font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-green-100">Maya</span>
                <span className="bg-gray-100 text-gray-700 text-[9px] sm:text-[11px] font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-gray-200">Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <hr className="border-[#f0e8e0] my-12 sm:my-16 max-w-7xl mx-auto" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg sm:text-xl font-medium text-[#2C2C2A] mb-6 sm:mb-8 text-center">How to apply your sticker</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { step: 1, title: "Clean your card", desc: "Wipe off any dust or oils for a perfect stick.", icon: Droplets, color: "bg-blue-100 text-blue-600" },
            { step: 2, title: "Peel slowly", desc: "Remove the backing paper from one corner.", icon: Copy, color: "bg-purple-100 text-purple-600" },
            { step: 3, title: "Align & press", desc: "Line up the edges and smooth out bubbles.", icon: LayoutGrid, color: "bg-amber-100 text-amber-600" },
            { step: 4, title: "Tap and go!", desc: "Your aesthetic card is ready for the commute.", icon: Smartphone, color: "bg-emerald-100 text-emerald-600" }
          ].map((item) => (
            <div key={item.step} className="bg-white border border-[#f0e8e0] rounded-[18px] p-5 sm:p-6 relative">
              <span className="absolute -top-3 -left-3 w-6 h-6 sm:w-8 sm:h-8 bg-[#D4537E] text-white rounded-full flex items-center justify-center text-xs sm:text-base font-medium shadow-sm">{item.step}</span>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 ${item.color}`}><item.icon className="w-4 h-4 sm:w-5 sm:h-5" /></div>
              <h3 className="font-medium text-[#2C2C2A] mb-1 text-sm sm:text-base">{item.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-[#f0e8e0] my-12 sm:my-16 max-w-7xl mx-auto" />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#f0e8e0] rounded-[20px] sm:rounded-[24px] p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8 sm:gap-10 shadow-sm">
          <div className="w-full md:w-auto flex justify-center items-center relative">
            <div className="w-40 sm:w-48 h-[100px] sm:h-[122px] bg-slate-800 rounded-xl border-2 border-slate-700 relative flex items-center justify-center shadow-lg">
              <span className="text-slate-400 font-medium text-xs sm:text-sm">85.6 × 54mm</span>
              <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-600 border-4 border-yellow-400 flex items-center justify-center text-[8px] sm:text-[10px] font-bold text-yellow-100 shadow-md">
                ₱1
              </div>
            </div>
          </div>
          <div className="flex-1 w-full">
            <h2 className="text-lg sm:text-xl font-medium text-[#2C2C2A] mb-3 sm:mb-4 text-center md:text-left">Size & compatibility</h2>
            <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <li className="flex justify-between text-xs sm:text-sm border-b border-[#f0e8e0] pb-2"><span className="text-gray-500">Dimensions</span><span className="font-medium text-[#2C2C2A]">85.6mm × 54.0mm</span></li>
              <li className="flex justify-between text-xs sm:text-sm border-b border-[#f0e8e0] pb-2"><span className="text-gray-500">Thickness</span><span className="font-medium text-[#2C2C2A]">0.1mm (Ultra-thin)</span></li>
              <li className="flex justify-between text-xs sm:text-sm border-b border-[#f0e8e0] pb-2"><span className="text-gray-500">Material</span><span className="font-medium text-[#2C2C2A]">Premium Vinyl Matte</span></li>
              <li className="flex justify-between text-xs sm:text-sm border-b border-[#f0e8e0] pb-2"><span className="text-gray-500">Fits</span><span className="font-medium text-[#2C2C2A]">Beep, Bank Cards, IDs</span></li>
            </ul>
            <div className="bg-[#EAF3DE] text-[#27500A] px-3 sm:px-4 py-2 sm:py-3 rounded-[10px] sm:rounded-[14px] text-xs sm:text-sm font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              NFC / RFID passes through easily.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}