import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase'; // <-- WE ARE IMPORTING SUPABASE HERE!

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
  imagePath: string;
  description: string;
};

type CheckoutState = {
  items: CheckoutItem[];
  shippingDetails: { fullName: string; phone: string; address: string; };
  paymentMethod: string | null;
  shippingMethod: 'jnt' | 'lalamove';
  user: User | null;
  wishlist: string[];
  
  // LIVE INVENTORY STATE
  products: Product[];
  isLoadingProducts: boolean;
  
  // SUPABASE ACTIONS
  fetchProducts: () => Promise<void>;
  addProductToDB: (productData: any, imageFile: File) => Promise<boolean>;
  updateProductStockInDB: (id: string, newStock: number) => Promise<boolean>;

  // STOREFRONT ACTIONS
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

      // --- SUPABASE BACKEND LOGIC ---
      fetchProducts: async () => {
        set({ isLoadingProducts: true });
        
        // 1. Fetch from the 'products' table in Supabase
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching products:", error);
          set({ isLoadingProducts: false });
          return;
        }

        if (data) {
          // 2. Map the SQL database columns to our frontend format
          const formattedProducts: Product[] = data.map(item => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            originalPrice: Number(item.original_price || item.price),
            category: item.category,
            badge: item.badge,
            stock: item.stock,
            maxStock: item.max_stock,
            rating: 5.0, // Hardcoded for now
            reviews: 0,  // Hardcoded for now
            color: item.color || "from-gray-200 to-gray-400",
            isBundleEligible: false,
            imagePath: item.image_path,
            description: item.description || ""
          }));
          
          set({ products: formattedProducts, isLoadingProducts: false });
        }
      },

      addProductToDB: async (productData, imageFile) => {
        try {
          // 1. Upload the image to the 'designs' bucket
          const fileExt = imageFile.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('designs')
            .upload(fileName, imageFile);

          if (uploadError) throw uploadError;

          // 2. Get the public URL of the uploaded image
          const { data: { publicUrl } } = supabase.storage
            .from('designs')
            .getPublicUrl(fileName);

          // 3. Insert the new product into the SQL database
          const { error: dbError } = await supabase.from('products').insert([{
            name: productData.name,
            price: productData.price,
            original_price: productData.originalPrice,
            category: productData.category,
            stock: productData.stock,
            description: productData.description,
            image_path: publicUrl, // Save the Supabase image URL!
            badge: "New Drop",
            color: "from-rose-200 to-amber-200" // Default gradient
          }]);

          if (dbError) throw dbError;

          // 4. Refresh the products list to show the new item instantly
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
          
          // Update local state instantly so the UI doesn't lag
          set((state) => ({
            products: state.products.map(p => p.id === id ? { ...p, stock: newStock } : p)
          }));
          return true;
        } catch (error) {
          console.error("Failed to update stock:", error);
          return false;
        }
      },

      // --- STOREFRONT LOGIC ---
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
        const subtotal = get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
        if (get().user?.isMember) return subtotal * 0.90; 
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
      // We don't want to persist the 'products' array anymore, because we want fresh data from Supabase every time!
      partialize: (state) => ({ 
        items: state.items, 
        user: state.user, 
        wishlist: state.wishlist, 
        shippingDetails: state.shippingDetails 
      }),
    }
  )
);