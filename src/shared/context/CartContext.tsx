import React, { createContext, useContext, useState } from "react";
import type { Product } from "../services/axios";

type CartItem = Product & { quantity: number };

type CartContextValue = {
  items: CartItem[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: number) => void;
  count: number;
  total: number;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  function addToCart(p: Product) {
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === p.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 };
        return copy;
      }
      return [...prev, { ...p, quantity: 1 }];
    });
    // open the cart dropdown when an item is added
    setIsOpen(true);
  }

  function removeFromCart(id: number) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  const count = items.reduce((s, it) => s + it.quantity, 0);
  const total = items.reduce((s, it) => s + Number(it.price.replace(/[^0-9.]/g, "")) * it.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, count, total, isOpen, setIsOpen }}>
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
