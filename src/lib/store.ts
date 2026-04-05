import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase';

type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type User = {
  name: string;
  email: string;
  school: string;
  college: string;
  yearLevel: string;
  isMember: boolean;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  badge: string | null;
  stock: number;
  maxStock: number;
  rating: number;
  reviews: number;
  color: string;
  isBundleEligible: boolean;
  frontImage: string;          // UPGRADED
  backImage: string | null;    // NEW
  description: string;
};

type CheckoutState = {
  items: CheckoutItem[];
  shippingDetails: { fullName: string; phone: string; address: string; };
  paymentMethod: string | null;
  shippingMethod: 'jnt' | 'lalamove';
  user: User | null;
  wishlist: string[];
  
  products: Product[];
  isLoadingProducts: boolean;
  
  fetchProducts: () => Promise<void>;
  // UPGRADED: Now accepts a front file, and an optional back file
  addProductToDB: (productData: any, frontFile: File, backFile: File | null) => Promise<boolean>;
  updateProductStockInDB: (id: string, newStock: number) => Promise<boolean>;

  addItem: (item: CheckoutItem) => void;
  updateShipping: (details: any) => void;
  setPaymentMethod: (method: string) => void;
  setShippingMethod: (method: 'jnt' | 'lalamove') => void;
  getTotal: () => number;
  clearCart: () => void;
  login: (user: User) => void;
  logout: () => void;
  toggleWishlist: (id: string) => void;
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      items: [],
      shippingDetails: { fullName: '', phone: '', address: '' },
      paymentMethod: null,
      shippingMethod: 'jnt', 
      user: null,
      wishlist: [],
      
      products: [],
      isLoadingProducts: false,

      fetchProducts: async () => {
        set({ isLoadingProducts: true });
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching products:", error);
          set({ isLoadingProducts: false });
          return;
        }

        if (data) {
          const formattedProducts: Product[] = data.map(item => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            originalPrice: Number(item.original_price || item.price),
            category: item.category,
            badge: item.badge,
            stock: item.stock,
            maxStock: item.max_stock,
            rating: 5.0, 
            reviews: 0, 
            color: item.color || "from-gray-200 to-gray-400",
            isBundleEligible: false,
            frontImage: item.front_image, // Mapped to new DB column
            backImage: item.back_image,   // Mapped to new DB column
            description: item.description || ""
          }));
          set({ products: formattedProducts, isLoadingProducts: false });
        }
      },

      addProductToDB: async (productData, frontFile, backFile) => {
        try {
          // 1. Upload Front Image
          const frontExt = frontFile.name.split('.').pop();
          const frontFileName = `front-${Date.now()}-${Math.random().toString(36).substring(2)}.${frontExt}`;
          const { error: frontErr } = await supabase.storage.from('designs').upload(frontFileName, frontFile);
          if (frontErr) throw frontErr;
          
          const frontUrl = supabase.storage.from('designs').getPublicUrl(frontFileName).data.publicUrl;

          // 2. Upload Back Image (Only if it exists!)
          let backUrl = null;
          if (backFile) {
            const backExt = backFile.name.split('.').pop();
            const backFileName = `back-${Date.now()}-${Math.random().toString(36).substring(2)}.${backExt}`;
            const { error: backErr } = await supabase.storage.from('designs').upload(backFileName, backFile);
            if (backErr) throw backErr;
            
            backUrl = supabase.storage.from('designs').getPublicUrl(backFileName).data.publicUrl;
          }

          // 3. Insert into Database
          const { error: dbError } = await supabase.from('products').insert([{
            name: productData.name,
            price: productData.price,
            original_price: productData.originalPrice,
            category: productData.category,
            stock: productData.stock,
            description: productData.description,
            front_image: frontUrl,
            back_image: backUrl,
            badge: backUrl ? "Back-to-Back" : "New Drop", // Cool dynamic badge!
            color: "from-rose-200 to-amber-200"
          }]);

          if (dbError) throw dbError;

          await get().fetchProducts();
          return true;
        } catch (error) {
          console.error("Failed to add product:", error);
          alert("Failed to add product. Check the console.");
          return false;
        }
      },

      updateProductStockInDB: async (id, newStock) => {
        try {
          const { error } = await supabase.from('products').update({ stock: newStock }).eq('id', id);
          if (error) throw error;
          set((state) => ({ products: state.products.map(p => p.id === id ? { ...p, stock: newStock } : p) }));
          return true;
        } catch (error) {
          console.error("Failed to update stock:", error);
          return false;
        }
      },

      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        if (existingItem) {
          return { items: state.items.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i) };
        }
        return { items: [...state.items, item] };
      }),
      updateShipping: (details) => set((state) => ({ shippingDetails: { ...state.shippingDetails, ...details } })),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setShippingMethod: (method) => set({ shippingMethod: method }),
      getTotal: () => {
        // Calculate the total number of stickers in the bag
        const totalQty = get().items.reduce((total, item) => total + item.quantity, 0);
        
        // THE VOLUME PRICING ENGINE
        // 1 sticker = ₱30. 2+ stickers = ₱24 each (₱48 pair, +₱24 succeeding)
        const subtotal = totalQty >= 2 ? (totalQty * 24) : (totalQty * 30);
        
        // Apply the 10% VIP member discount on top if they are logged in!
        if (get().user?.isMember) {
          return subtotal * 0.90; 
        }
        
        return subtotal;
      },
      clearCart: () => set({ items: [] }),
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      toggleWishlist: (id) => set((state) => ({
        wishlist: state.wishlist.includes(id) ? state.wishlist.filter(wId => wId !== id) : [...state.wishlist, id]
      })),
    }),
    { 
      name: 'polycrafted-storage',
      partialize: (state) => ({ items: state.items, user: state.user, wishlist: state.wishlist, shippingDetails: state.shippingDetails }),
    }
  )
);