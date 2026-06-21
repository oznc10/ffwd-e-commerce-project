// next-intl locale-aware navigasyon yardımcıları
// Bu dosyadan import edilen Link, useRouter vb. locale prefix'i otomatik yönetir
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
