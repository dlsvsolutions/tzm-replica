import { create } from 'zustand';
import { CartItem } from '../types/cart';
import { Product } from '../types/product';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  addBundle: (products: Product[]) => void;
  clearCart: () => void;
  getItemCount: (productId: string) => number;
  getTotalItems: () => number;
  getSubtotalUsd: () => number;
  getSubtotalBs: (rate: number) => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((item) => item.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return {
        items: [...state.items, { product, quantity }],
      };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }));
  },

  addBundle: (products) => {
    set((state) => {
      let updated = [...state.items];
      for (const prod of products) {
        const idx = updated.findIndex((i) => i.product.id === prod.id);
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        } else {
          updated.push({ product: prod, quantity: 1 });
        }
      }
      return { items: updated, isOpen: true }; // Open cart to confirm bundle addition
    });
  },

  clearCart: () => set({ items: [] }),

  getItemCount: (productId) => {
    const item = get().items.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  },

  getTotalItems: () => {
    return get().items.reduce((acc, item) => acc + item.quantity, 0);
  },

  getSubtotalUsd: () => {
    return Number(
      get()
        .items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
        .toFixed(2)
    );
  },

  getSubtotalBs: (rate) => {
    const totalUsd = get().getSubtotalUsd();
    return Number((totalUsd * rate).toFixed(2));
  },
}));
