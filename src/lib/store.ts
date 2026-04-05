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
  frontImage: string;
  backImage: string | null;
  description: string;
};

export type PickupSchedule = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  isActive: boolean; // Added so admin knows if it's currently bookable
};

type CheckoutState = {
  items: CheckoutItem[];
  shippingDetails: { fullName: string; phone: string; address: string; };
  paymentMethod: string | null;
  shippingMethod: 'jnt' | 'lalamove' | 'pickup'; 
  user: User | null;
  wishlist: string[];
  
  products: Product[];
  isLoadingProducts: boolean;
  
  schedules: PickupSchedule[]; // Storefront active schedules
  adminSchedules: PickupSchedule[]; // ALL schedules (for ERP)
  selectedPickup: PickupSchedule | null;
  
  fetchProducts: () => Promise<void>;
  fetchSchedules: () => Promise<void>; 
  fetchAllSchedules: () => Promise<void>; // NEW: For Admin ERP
  
  addProductToDB: (productData: any, frontFile: File, backFile: File | null) => Promise<boolean>;
  updateProductStockInDB: (id: string, newStock: number) => Promise<boolean>;
  
  // NEW: Schedule Admin Functions
  addScheduleToDB: (date: string, startTime: string, endTime: string, location: string) => Promise<boolean>;
  toggleScheduleStatusDB: (id: string, currentStatus: boolean) => Promise<boolean>;

  addItem: (item: CheckoutItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  updateShipping: (details: any) => void;
  setPaymentMethod: (method: string) => void;
  setShippingMethod: (method: 'jnt' | 'lalamove' | 'pickup') => void;
  setPickupSchedule: (schedule: PickupSchedule | null) => void;
  
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
      
      schedules: [],
      adminSchedules: [],
      selectedPickup: null,

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
            frontImage: item.front_image,
            backImage: item.back_image,
            description: item.description || ""
          }));
          set({ products: formattedProducts, isLoadingProducts: false });
        }
      },

      fetchSchedules: async () => {
        const { data, error } = await supabase
          .from('pickup_schedules')
          .select('*')
          .eq('is_active', true)
          .order('pickup_date', { ascending: true });
          
        if (error) {
          console.error("Error fetching schedules:", error);
          return;
        }

        if (data) {
          const formattedSchedules: PickupSchedule[] = data.map(item => ({
            id: item.id,
            date: item.pickup_date,
            startTime: item.start_time,
            endTime: item.end_time,
            location: item.location,
            isActive: item.is_active
          }));
          set({ schedules: formattedSchedules });
        }
      },

      fetchAllSchedules: async () => {
        const { data, error } = await supabase
          .from('pickup_schedules')
          .select('*')
          .order('pickup_date', { ascending: true })
          .order('start_time', { ascending: true });
          
        if (error) {
          console.error("Error fetching all schedules:", error);
          return;
        }

        if (data) {
          const formattedSchedules: PickupSchedule[] = data.map(item => ({
            id: item.id,
            date: item.pickup_date,
            startTime: item.start_time,
            endTime: item.end_time,
            location: item.location,
            isActive: item.is_active
          }));
          set({ adminSchedules: formattedSchedules });
        }
      },

      addProductToDB: async (productData, frontFile, backFile) => {
        try {
          const frontExt = frontFile.name.split('.').pop();
          const frontFileName = `front-${Date.now()}-${Math.random().toString(36).substring(2)}.${frontExt}`;
          const { error: frontErr } = await supabase.storage.from('designs').upload(frontFileName, frontFile);
          if (frontErr) throw frontErr;
          
          const frontUrl = supabase.storage.from('designs').getPublicUrl(frontFileName).data.publicUrl;

          let backUrl = null;
          if (backFile) {
            const backExt = backFile.name.split('.').pop();
            const backFileName = `back-${Date.now()}-${Math.random().toString(36).substring(2)}.${backExt}`;
            const { error: backErr } = await supabase.storage.from('designs').upload(backFileName, backFile);
            if (backErr) throw backErr;
            
            backUrl = supabase.storage.from('designs').getPublicUrl(backFileName).data.publicUrl;
          }

          const { error: dbError } = await supabase.from('products').insert([{
            name: productData.name,
            price: productData.price,
            original_price: productData.originalPrice,
            category: productData.category,
            stock: productData.stock,
            description: productData.description,
            front_image: frontUrl,
            back_image: backUrl,
            badge: backUrl ? "Back-to-Back" : "New Drop",
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

      addScheduleToDB: async (date, startTime, endTime, location) => {
        try {
          const { error } = await supabase.from('pickup_schedules').insert([{
            pickup_date: date,
            start_time: startTime,
            end_time: endTime,
            location: location,
            is_active: true
          }]);

          if (error) throw error;
          await get().fetchAllSchedules();
          return true;
        } catch (error) {
          console.error("Failed to add schedule:", error);
          return false;
        }
      },

      toggleScheduleStatusDB: async (id, currentStatus) => {
        try {
          const { error } = await supabase.from('pickup_schedules').update({ is_active: !currentStatus }).eq('id', id);
          if (error) throw error;
          await get().fetchAllSchedules();
          return true;
        } catch (error) {
          console.error("Failed to toggle status:", error);
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
      
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(item => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)
      })),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),

      updateShipping: (details) => set((state) => ({ shippingDetails: { ...state.shippingDetails, ...details } })),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      
      setShippingMethod: (method) => set((state) => ({ 
        shippingMethod: method,
        selectedPickup: method !== 'pickup' ? null : state.selectedPickup 
      })),
      
      setPickupSchedule: (schedule) => set({ selectedPickup: schedule }),

      getTotal: () => {
        const totalQty = get().items.reduce((total, item) => total + item.quantity, 0);
        const subtotal = totalQty >= 2 ? (totalQty * 24) : (totalQty * 30);
        
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
      partialize: (state) => ({ 
        items: state.items, 
        user: state.user, 
        wishlist: state.wishlist, 
        shippingDetails: state.shippingDetails,
        shippingMethod: state.shippingMethod,
        selectedPickup: state.selectedPickup
      }),
    }
  )
);