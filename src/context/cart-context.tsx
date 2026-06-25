"use client";

// Sepet state'ini uygulama genelinde yöneten Context
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItem } from "@/types";

const STORAGE_KEY = "cart";

interface CartContextValue {
  items: CartItem[];
  addToCart: (productId: number, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  isInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  // localStorage okuma tamamlanana kadar false — yazma effect'i bu flag'e bakarak
  // erken çalışıp boş diziyi kaydetmesini önler (locale değişimi gibi yeniden
  // mount durumlarında oluşan race condition'ı kapatır)
  const [isLoaded, setIsLoaded] = useState(false);

  // İlk yüklemede localStorage'dan sepeti oku; okuma bitince isLoaded'ı aç
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored) as CartItem[]);
      }
    } catch {
      // Bozuk veri varsa sıfırla
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsLoaded(true);
  }, []);

  // Sepet her değiştiğinde localStorage'a yaz — ama yalnızca okuma tamamlandıktan sonra
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isLoaded]);

  const addToCart = useCallback((productId: number, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { productId, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  // quantity 0 veya altına düşerse ürünü sepetten kaldır
  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemCount = useCallback(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const isInCart = useCallback(
    (productId: number) => items.some((i) => i.productId === productId),
    [items]
  );

  const getItemQuantity = useCallback(
    (productId: number) =>
      items.find((i) => i.productId === productId)?.quantity ?? 0,
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
