"use client";
import { useState, use } from "react";
import Link from "next/link";
import { 
  ShoppingBag, Heart, ChevronRight, Star, Plus, Minus, 
  CheckCircle2, Copy, MessageCircle, Camera, Smartphone, 
  Droplets, ShieldCheck, HelpCircle, LayoutGrid, X, Layers
} from "lucide-react";
import { useCheckoutStore } from "@/lib/store";

// THE 3D CSS ANIMATION
const style = `
  @keyframes sway {
    0% { transform: rotateY(-12deg) rotateX(4deg); }
    50% { transform: rotateY(12deg) rotateX(-4deg); }
    100% { transform: rotateY(-4deg) rotateX(8deg); }
  }
  .perspective-container { perspective: 1200px; }
  .sway-card {
    animation: sway 7s ease-in-out infinite alternate;
    transform-style: preserve-3d;
  }
  .sway-card:hover { animation-play-state: paused; }
  .card-depth::before {
    content: '';
    position: absolute;
    inset: -1px;
    background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%);
    border-radius: 20px;
    z-index: -1;
    transform: translateZ(-1px);
  }
`;

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  // PULL GLOBAL STATE FROM STORE
  const { addItem, items, getTotal, products, wishlist, toggleWishlist } = useCheckoutStore();
  
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // FIND THE PRODUCT BASED ON THE URL ID FROM THE STORE ARRAY
  const product = products.find((p) => p.id === resolvedParams.id);

  // If someone types an invalid ID like /product/999
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf8f5]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#2C2C2A] mb-4">Design not found</h1>
          <Link href="/catalog" className="text-[#D4537E] hover:underline">Return to catalog</Link>
        </div>
      </div>
    );
  }

  const savings = product.originalPrice - product.price;
  const isSaved = wishlist.includes(product.id);
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  const activeUnitPrice = cartItemCount >= 2 ? 24 : 30;

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price, quantity: quantity });
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f5] text-[#2C2C2A] font-sans pb-24 relative">
      <style>{style}</style>

      {/* --- UPGRADED SLIDE-OUT CART DRAWER --- */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 transition-opacity backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
      )}
      
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-6 border-b border-[#f0e8e0]">
          <h2 className="text-xl font-medium text-[#2C2C2A] flex items-center gap-2">
            My bag <span className="text-sm font-normal text-gray-500">({cartItemCount} items)</span>
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* THE NEW VOLUME PRICING PROGRESS BAR */}
          <div className="bg-[#FBEAF0]/50 p-6 border-b border-[#f0e8e0]">
            {cartItemCount === 0 ? (
               <div>
                 <p className="text-sm font-bold text-[#D4537E] mb-1">Unlock Pair Pricing!</p>
                 <p className="text-xs text-gray-600">Buy any 2 stickers to drop the price to ₱24 each.</p>
               </div>
            ) : cartItemCount === 1 ? (
               <div>
                 <p className="text-sm font-bold text-[#D4537E] mb-1">You're almost there!</p>
                 <p className="text-xs text-gray-600 mb-3">Add 1 more sticker to save ₱12 on your order.</p>
                 <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#f0e8e0]">
                   <div className="bg-[#D4537E] h-full w-1/2 transition-all duration-500"></div>
                 </div>
               </div>
            ) : (
               <div>
                 <p className="text-sm font-bold text-[#71A051] mb-1 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> Pair Promo Active!</p>
                 <p className="text-xs text-gray-600 mb-3">Awesome! All stickers are now only ₱24.00 each.</p>
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
                {items.map((item, index) => (
                  <li key={`${item.id}-${index}`} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#f0e8e0] to-gray-200 border border-gray-100 flex-shrink-0 flex items-center justify-center text-[10px] text-gray-400 uppercase font-bold text-center p-2">
                      {item.name.split(' ')[0]}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-[#2C2C2A] line-clamp-2">{item.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-[#2C2C2A] mt-1 flex items-center gap-2">
                        ₱{(activeUnitPrice * item.quantity).toFixed(2)}
                        {cartItemCount >= 2 && <span className="text-[10px] text-gray-400 line-through font-normal">₱{(30 * item.quantity).toFixed(2)}</span>}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-[#f0e8e0] bg-[#fdf8f5]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-base font-medium text-[#2C2C2A]">Subtotal</span>
              <span className="text-2xl font-bold text-[#2C2C2A]">₱{getTotal().toFixed(2)}</span>
            </div>
            <Link href="/checkout/details" className="w-full flex justify-center items-center bg-[#D4537E] text-white py-3.5 rounded-full text-base font-medium hover:bg-[#b8436b] transition-colors shadow-sm">
              Go to checkout
            </Link>
          </div>
        )}
      </div>

      {/* TOP NAV */}
      <nav className="sticky top-0 z-40 bg-[#fdf8f5]/90 backdrop-blur-md border-b border-[#f0e8e0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center text-sm font-medium text-gray-500">
            <Link href="/" className="hover:text-[#D4537E] transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-1 opacity-50" />
            <Link href="/catalog" className="hover:text-[#D4537E] transition-colors">Catalog</Link>
            <ChevronRight className="w-4 h-4 mx-1 opacity-50" />
            <span className="text-[#2C2C2A]">{product.category}</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => toggleWishlist(product.id)}
              className="text-gray-600 hover:text-[#D4537E] transition-colors relative"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-[#D4537E] rounded-full"></span>}
            </button>
            <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-2 bg-white border border-[#f0e8e0] px-3 py-1.5 rounded-full text-sm font-medium shadow-sm hover:border-gray-300 transition-all">
              <ShoppingBag className="w-4 h-4" />
              {cartItemCount > 0 && <span className="bg-[#2C2C2A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cartItemCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* LEFT COLUMN: 3D Image Area */}
          <div className="flex flex-col items-center">
            <div className="perspective-container w-full max-w-md aspect-[1.58/1] relative flex justify-center items-center py-8">
              <div className={`sway-card card-depth w-[85%] h-full rounded-[20px] shadow-2xl relative overflow-hidden bg-gradient-to-br ${product.color}`}>
                <div 
                  className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
                  style={{ backgroundImage: `url('${product.frontImage}')` }}
                />
              </div>
            </div>

            <p className="text-xs text-gray-400 font-medium mt-4 text-center">
              Hover card to pause
            </p>

            {/* Share Buttons */}
            <div className="flex items-center gap-3 mt-10 text-sm font-medium text-gray-500">
              <span>Share design:</span>
              <button className="flex items-center gap-1.5 bg-white border border-[#f0e8e0] px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"><Copy className="w-3.5 h-3.5" /> Copy link</button>
              <button className="flex items-center gap-1.5 bg-white border border-[#f0e8e0] px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors text-pink-600"><Camera className="w-3.5 h-3.5" /> IG</button>
              <button className="flex items-center gap-1.5 bg-white border border-[#f0e8e0] px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors text-blue-600"><MessageCircle className="w-3.5 h-3.5" /> Chat</button>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Info */}
          <div className="flex flex-col">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-[#EEEDFE] text-[#3C3489] text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full">{product.category}</span>
              {product.backImage && <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"><Layers className="w-3 h-3"/> Back-to-Back Set</span>}
              <span className="bg-[#EAF3DE] text-[#27500A] text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full">NFC-safe</span>
            </div>

            <h1 className="text-[22px] font-medium text-[#2C2C2A] mb-3 leading-snug">{product.name}</h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">{product.description}</p>

            <div className="flex items-center gap-1.5 mb-6">
              <div className="flex text-[#D28E3D]">
                <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 text-gray-300" />
              </div>
              <span className="text-sm font-medium text-gray-700 ml-1">4.0</span>
            </div>

            {/* UPGRADED PRICING DISPLAY */}
            <div className="bg-[#fdf8f5] border border-[#f0e8e0] rounded-xl p-5 mb-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pricing</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#2C2C2A]">₱{product.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-500 font-medium">/ solo piece</span>
                  </div>
                </div>
                <div className="bg-[#EAF3DE] text-[#27500A] px-3 py-2 rounded-lg text-xs font-bold shadow-sm">
                  Drops to ₱24.00 if you buy 2+
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-8">
              <span className={`w-2 h-2 rounded-full animate-pulse ${product.stock <= 5 ? 'bg-red-500' : 'bg-[#D28E3D]'}`}></span>
              <span className={`text-sm font-medium ${product.stock <= 5 ? 'text-red-500' : 'text-[#D28E3D]'}`}>
                {product.stock <= 5 ? `Almost gone! Only ${product.stock} left` : `Only ${product.stock} left in stock — order soon`}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center bg-white border border-[#f0e8e0] rounded-full h-12 px-2 shadow-sm">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black"><Minus className="w-4 h-4" /></button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black"><Plus className="w-4 h-4" /></button>
              </div>
              
              <button onClick={handleAddToCart} className="flex-1 bg-[#D4537E] text-white h-12 rounded-full text-base font-medium shadow-sm hover:bg-[#b8436b] transition-all transform hover:scale-[1.02]">
                Add to bag
              </button>
              
              <button 
                onClick={() => toggleWishlist(product.id)} 
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                  isSaved ? 'border-[#D4537E] bg-[#FBEAF0]' : 'border-[#f0e8e0] bg-white hover:border-gray-300'
                }`}
              >
                <Heart className={`w-5 h-5 transition-colors ${isSaved ? 'fill-[#D4537E] text-[#D4537E]' : 'text-[#D4537E]'}`} />
              </button>
            </div>

            <div className="bg-[#FAEEDA]/50 border border-[#FAEEDA] rounded-[14px] p-4 text-center mb-8">
              <span className="text-[#633806] text-sm font-medium">✨ Pair any 2 stickers to unlock the promo price</span>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-[#71A051] flex-shrink-0 mt-0.5" /><span className="text-sm text-gray-600 font-medium">Water-resistant & scratch-proof matte finish</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-[#71A051] flex-shrink-0 mt-0.5" /><span className="text-sm text-gray-600 font-medium">Leaves no residue when removed</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-[#71A051] flex-shrink-0 mt-0.5" /><span className="text-sm text-gray-600 font-medium">Standard Beep card dimensions</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-[#71A051] flex-shrink-0 mt-0.5" /><span className="text-sm text-gray-600 font-medium">NFC signal passes through normally</span></li>
            </ul>

            <div className="pt-6 border-t border-[#f0e8e0]">
              <p className="text-xs text-gray-400 font-medium mb-3">Secure payments accepted</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-50 text-blue-700 text-[11px] font-medium px-3 py-1.5 rounded-full border border-blue-100">GCash</span>
                <span className="bg-green-50 text-green-700 text-[11px] font-medium px-3 py-1.5 rounded-full border border-green-100">Maya</span>
                <span className="bg-gray-100 text-gray-700 text-[11px] font-medium px-3 py-1.5 rounded-full border border-gray-200">Cash on Delivery</span>
                <span className="bg-gray-100 text-gray-700 text-[11px] font-medium px-3 py-1.5 rounded-full border border-gray-200">Bank Transfer</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      <hr className="border-[#f0e8e0] my-16 max-w-7xl mx-auto" />

      {/* SECTION 1: How to apply */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-medium text-[#2C2C2A] mb-8 text-center">How to apply your sticker</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: 1, title: "Clean your card", desc: "Wipe off any dust or oils for a perfect stick.", icon: Droplets, color: "bg-blue-100 text-blue-600" },
            { step: 2, title: "Peel slowly", desc: "Remove the backing paper from one corner.", icon: Copy, color: "bg-purple-100 text-purple-600" },
            { step: 3, title: "Align & press", desc: "Line up the edges and smooth out bubbles.", icon: LayoutGrid, color: "bg-amber-100 text-amber-600" },
            { step: 4, title: "Tap and go!", desc: "Your aesthetic card is ready for the commute.", icon: Smartphone, color: "bg-emerald-100 text-emerald-600" }
          ].map((item) => (
            <div key={item.step} className="bg-white border border-[#f0e8e0] rounded-[18px] p-6 relative">
              <span className="absolute -top-3 -left-3 w-8 h-8 bg-[#D4537E] text-white rounded-full flex items-center justify-center font-medium shadow-sm">
                {item.step}
              </span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-[#2C2C2A] mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-[#f0e8e0] my-16 max-w-7xl mx-auto" />

      {/* SECTION 2: Size & Compatibility */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#f0e8e0] rounded-[24px] p-8 md:p-10 flex flex-col md:flex-row items-center gap-10 shadow-sm">
          <div className="flex-1 flex justify-center items-center relative">
            <div className="w-48 h-[122px] bg-slate-800 rounded-xl border-2 border-slate-700 relative flex items-center justify-center shadow-lg">
              <span className="text-slate-400 font-medium text-sm">85.6 × 54mm</span>
              <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-yellow-600 border-4 border-yellow-400 flex items-center justify-center text-[10px] font-bold text-yellow-100 shadow-md">
                ₱1
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-medium text-[#2C2C2A] mb-4">Size & compatibility</h2>
            <ul className="space-y-3 mb-6">
              <li className="flex justify-between text-sm border-b border-[#f0e8e0] pb-2">
                <span className="text-gray-500">Dimensions</span>
                <span className="font-medium text-[#2C2C2A]">85.6mm × 54.0mm</span>
              </li>
              <li className="flex justify-between text-sm border-b border-[#f0e8e0] pb-2">
                <span className="text-gray-500">Thickness</span>
                <span className="font-medium text-[#2C2C2A]">0.1mm (Ultra-thin)</span>
              </li>
              <li className="flex justify-between text-sm border-b border-[#f0e8e0] pb-2">
                <span className="text-gray-500">Material</span>
                <span className="font-medium text-[#2C2C2A]">Premium Vinyl Matte</span>
              </li>
              <li className="flex justify-between text-sm border-b border-[#f0e8e0] pb-2">
                <span className="text-gray-500">Fits</span>
                <span className="font-medium text-[#2C2C2A]">Beep, Bank Cards, IDs</span>
              </li>
            </ul>
            <div className="bg-[#EAF3DE] text-[#27500A] px-4 py-3 rounded-[14px] text-sm font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              NFC / RFID passes through — tested on tap gates.
            </div>
          </div>
        </div>
      </section>

      <hr className="border-[#f0e8e0] my-16 max-w-7xl mx-auto" />

      {/* SECTION 3: Reviews */}
      <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-medium text-[#2C2C2A] mb-8">Customer reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white border border-[#f0e8e0] rounded-[18px] p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">MJ</div>
                <div>
                  <p className="font-medium text-[#2C2C2A] text-sm">Maria Joy T.</p>
                  <p className="text-xs text-gray-400">Oct 12, 2025</p>
                </div>
              </div>
              <span className="bg-[#EAF3DE] text-[#27500A] text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified buyer
              </span>
            </div>
            <div className="flex text-[#D28E3D] mb-3">
              <Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Super ganda ng quality in person! The neon colors really pop. Kinabahan ako baka hindi gumana sa LRT tap station, pero 100% working siya. Will order the Sanrio ones next!
            </p>
          </div>

          <div className="bg-white border border-[#f0e8e0] rounded-[18px] p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">KL</div>
                <div>
                  <p className="font-medium text-[#2C2C2A] text-sm">Ken L.</p>
                  <p className="text-xs text-gray-400">Sep 28, 2025</p>
                </div>
              </div>
              <span className="bg-[#EAF3DE] text-[#27500A] text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified buyer
              </span>
            </div>
            <div className="flex text-[#D28E3D] mb-3">
              <Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 text-gray-300" />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Solid nung matte finish, hindi nagmamarka yung fingerprints. Ang daling magbayad via GCash tapos nadeliver agad kinabukasan. Slightly medyo off center lang dikit ko haha.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}