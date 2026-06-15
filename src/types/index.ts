// Veritabanı ve uygulama genelinde kullanılan TypeScript tip tanımları

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category_id: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  total_amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shipping_name: string;
  shipping_address: string;
  shipping_phone: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
}

// Sepet öğesi - sadece frontend state için kullanılır
export interface CartItem {
  productId: number;
  quantity: number;
}

// Ürünü kategori bilgileriyle birlikte döndürmek için genişletilmiş tip
export interface ProductWithCategory extends Product {
  category_name: string;
  category_slug: string;
}

// Siparişi öğeleriyle birlikte döndürmek için genişletilmiş tip
export interface OrderWithItems extends Order {
  items: OrderItem[];
}

// Session'da tutulan minimal kullanıcı bilgisi
export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}
