// useTheme hook'u — ThemeContext'e erişim sağlar
import { useContext } from "react";
import { ThemeContext } from "@/context/theme-context";

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme hook'u ThemeProvider içinde kullanılmalıdır");
  }
  return ctx;
}
