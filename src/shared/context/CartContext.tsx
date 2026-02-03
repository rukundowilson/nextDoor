import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "../services/axios";

type CartItem = Product & { cartQuantity: number };

type CartContextValue = {
  items: CartItem[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, cartQuantity: number, maxQuantity?: number) => void;
  clearCart: () => void;
  count: number;
  total: number;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const CART_STORAGE_KEY = "nextdoor_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        setItems(parsed);
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
    setIsHydrated(true);
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
      }
    }
  }, [items, isHydrated]);

  function addToCart(p: Product) {
    // Check if product has stock
    if (!p.quantity || p.quantity <= 0) {
      console.warn(`Product ${p.title} is out of stock`);
      return;
    }

    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === p.id);
      if (idx >= 0) {
        // Check if adding another item would exceed stock
        if (prev[idx].cartQuantity >= (p.quantity || 1)) {
          console.warn(`Cannot add more of ${p.title} - limited by stock`);
          return prev;
        }
        const copy = [...prev];
        copy[idx] = { ...copy[idx], cartQuantity: copy[idx].cartQuantity + 1 };
        return copy;
      }
      return [...prev, { ...p, cartQuantity: 1 }];
    });
    // open the cart dropdown when an item is added
    setIsOpen(true);
  }

  function removeFromCart(id: number) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  function updateQuantity(id: number, cartQuantity: number, maxQuantity?: number) {
    if (cartQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    // Respect stock limit if provided
    const finalQuantity = maxQuantity ? Math.min(cartQuantity, maxQuantity) : cartQuantity;

    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], cartQuantity: finalQuantity };
        return copy;
      }
      return prev;
    });
  }

  function clearCart() {
    setItems([]);
  }

  const count = items.reduce((s, it) => s + it.cartQuantity, 0);
  const total = items.reduce((s, it) => s + Number(it.price.replace(/[^0-9.]/g, "")) * it.cartQuantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, count, total, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export default CartContext;
