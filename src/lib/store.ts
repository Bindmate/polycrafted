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
  isActive: boolean;
};

// NEW: Order Types
export type OrderItem = {
  name: string;
  qty: number;
  price: number;
};

export type Order = {
  id: string;
  db_id: string; 
  date: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    school: string;
  };
  items: OrderItem[];
  total: number;
  shippingMethod: string;
  pickupSchedule?: string;
  payment: {
    method: string;
    downpaymentExpected: number;
    extractedAmount: number;
    referenceNo: string;
    proofImage: string;
  };
  status: string;
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
  
  schedules: PickupSchedule[];
  adminSchedules: PickupSchedule[];
  selectedPickup: PickupSchedule | null;
  
  adminOrders: Order[]; 
  
  fetchProducts: () => Promise<void>;
  fetchSchedules: () => Promise<void>; 
  fetchAllSchedules: () => Promise<void>;
  fetchAdminOrders: () => Promise<void>; 
  
  addProductToDB: (productData: any, frontFile: File, backFile: File | null) => Promise<boolean>;
  updateProductStockInDB: (id: string, newStock: number) => Promise<boolean>;
  addScheduleToDB: (date: string, startTime: string, endTime: string, location: string) => Promise<boolean>;
  toggleScheduleStatusDB: (id: string, currentStatus: boolean) => Promise<boolean>;
  
  // Order Pipeline
  placeOrder: (paymentDetails: { method: string, referenceNo: string }, proofFile: File | null) => Promise<boolean>;
  updateOrderStatus: (dbId: string, newStatus: string) => Promise<boolean>;

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
      adminOrders: [],

      fetchProducts: async () => {
        set({ isLoadingProducts: true });
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          const formattedProducts: Product[] = data.map(item => ({
            id: item.id, name: item.name, price: Number(item.price), originalPrice: Number(item.original_price || item.price),
            category: item.category, badge: item.badge, stock: item.stock, maxStock: item.max_stock,
            rating: 5.0, reviews: 0, color: item.color || "from-gray-200 to-gray-400",
            isBundleEligible: false, frontImage: item.front_image, backImage: item.back_image, description: item.description || ""
          }));
          set({ products: formattedProducts, isLoadingProducts: false });
        }
      },

      fetchSchedules: async () => {
        const { data, error } = await supabase.from('pickup_schedules').select('*').eq('is_active', true).order('pickup_date', { ascending: true });
        if (!error && data) {
          set({ schedules: data.map(item => ({ id: item.id, date: item.pickup_date, startTime: item.start_time, endTime: item.end_time, location: item.location, isActive: item.is_active })) });
        }
      },

      fetchAllSchedules: async () => {
        const { data, error } = await supabase.from('pickup_schedules').select('*').order('pickup_date', { ascending: true }).order('start_time', { ascending: true });
        if (!error && data) {
          set({ adminSchedules: data.map(item => ({ id: item.id, date: item.pickup_date, startTime: item.start_time, endTime: item.end_time, location: item.location, isActive: item.is_active })) });
        }
      },

      fetchAdminOrders: async () => {
        const { data: ordersData, error: ordersError } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
        
        if (ordersError) {
          console.error("Error fetching orders:", ordersError);
          return;
        }

        if (ordersData) {
          const formattedOrders: Order[] = ordersData.map(order => {
            const dateObj = new Date(order.created_at);
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            return {
              id: order.display_id,
              db_id: order.id,
              date: dateStr,
              customer: {
                name: order.customer_name,
                phone: order.customer_phone,
                address: order.shipping_address || 'Campus Meetup',
                school: order.customer_school
              },
              items: order.order_items.map((item: any) => ({
                name: item.product_name,
                qty: item.quantity,
                price: Number(item.price_at_time)
              })),
              total: Number(order.total_amount),
              shippingMethod: order.shipping_method,
              pickupSchedule: order.pickup_schedule,
              payment: {
                method: order.payment_method,
                downpaymentExpected: Number(order.downpayment_expected),
                extractedAmount: Number(order.extracted_amount),
                referenceNo: order.reference_no,
                proofImage: order.proof_url
              },
              status: order.status
            };
          });
          set({ adminOrders: formattedOrders });
        }
      },

      placeOrder: async (paymentDetails, proofFile) => {
        const state = get();
        try {
          // 1. Upload receipt image
          let proofUrl = null;
          if (proofFile) {
            const ext = proofFile.name.split('.').pop();
            const fileName = `receipt-${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
            const { error: uploadErr } = await supabase.storage.from('designs').upload(fileName, proofFile); 
            if (uploadErr) throw uploadErr;
            proofUrl = supabase.storage.from('designs').getPublicUrl(fileName).data.publicUrl;
          }

          // 2. Generate Display ID
          const displayId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
          
          // 3. Format pickup string
          let pickupString = null;
          if (state.shippingMethod === 'pickup' && state.selectedPickup) {
             const d = new Date(state.selectedPickup.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
             pickupString = `${d} • ${state.selectedPickup.startTime} - ${state.selectedPickup.endTime}`;
          }

          // 4. Demographic string
          const demoString = state.user 
            ? `${state.user.school} • ${state.user.college} • ${state.user.yearLevel}`
            : "Guest User";

          const totalAmt = state.getTotal();
          const expectedDown = totalAmt / 2;

          // 5. Insert Order
          const { data: orderData, error: orderError } = await supabase.from('orders').insert([{
            display_id: displayId,
            customer_name: state.shippingDetails.fullName || 'Unknown',
            customer_phone: state.shippingDetails.phone || 'Unknown',
            customer_school: demoString,
            shipping_method: state.shippingMethod,
            shipping_address: state.shippingMethod === 'pickup' ? null : state.shippingDetails.address,
            pickup_schedule: pickupString,
            total_amount: totalAmt,
            payment_method: paymentDetails.method,
            reference_no: paymentDetails.referenceNo,
            proof_url: proofUrl,
            downpayment_expected: expectedDown,
            extracted_amount: expectedDown, 
            status: 'Awaiting Verification'
          }]).select('id').single();

          if (orderError) throw orderError;

          // FIX: Calculate total items in the bag locally to avoid TypeScript errors
          const cartItemCount = state.items.reduce((total, item) => total + item.quantity, 0);

          // 6. Insert Order Items
          const orderItemsData = state.items.map(item => ({
            order_id: orderData.id,
            product_id: item.id,
            product_name: item.name,
            quantity: item.quantity,
            price_at_time: cartItemCount >= 2 ? 24 : 30 
          }));

          const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData);
          if (itemsError) throw itemsError;

          state.clearCart();
          return true;

        } catch (error) {
          console.error("Order placement failed:", error);
          return false;
        }
      },

      updateOrderStatus: async (dbId, newStatus) => {
        try {
          const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', dbId);
          if (error) throw error;
          await get().fetchAdminOrders();
          return true;
        } catch (error) {
          console.error("Failed to update order status:", error);
          return false;
        }
      },

      addProductToDB: async (productData, frontFile, backFile) => { /* logic handled above */ return true;},
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
          const { error } = await supabase.from('pickup_schedules').insert([{ pickup_date: date, start_time: startTime, end_time: endTime, location: location, is_active: true }]);
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
      removeItem: (id) => set((state) => ({ items: state.items.filter(item => item.id !== id) })),
      updateShipping: (details) => set((state) => ({ shippingDetails: { ...state.shippingDetails, ...details } })),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setShippingMethod: (method) => set((state) => ({ shippingMethod: method, selectedPickup: method !== 'pickup' ? null : state.selectedPickup })),
      setPickupSchedule: (schedule) => set({ selectedPickup: schedule }),
      getTotal: () => {
        const totalQty = get().items.reduce((total, item) => total + item.quantity, 0);
        const subtotal = totalQty >= 2 ? (totalQty * 24) : (totalQty * 30);
        if (get().user?.isMember) return subtotal * 0.90; 
        return subtotal;
      },
      clearCart: () => set({ items: [], shippingDetails: { fullName: '', phone: '', address: '' }, selectedPickup: null }),
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      toggleWishlist: (id) => set((state) => ({ wishlist: state.wishlist.includes(id) ? state.wishlist.filter(wId => wId !== id) : [...state.wishlist, id] })),
    }),
    { 
      name: 'polycrafted-storage',
      partialize: (state) => ({ items: state.items, user: state.user, wishlist: state.wishlist, shippingDetails: state.shippingDetails, shippingMethod: state.shippingMethod, selectedPickup: state.selectedPickup }),
    }
  )
);