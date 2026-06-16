// useCart — sepet state'ine erişmek için custom hook
import { useContext } from "react";
import { CartContext } from "@/context/cart-context";

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart hook'u CartProvider içinde kullanılmalıdır");
  }
  return ctx;
}
