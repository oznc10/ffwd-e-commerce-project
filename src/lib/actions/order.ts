"use server";

// Sipariş oluşturma ve sorgulama server action'ları
import { z } from "zod";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/session";
import type { Order, OrderItem, OrderWithItems } from "@/types";

// ── Zod şeması ────────────────────────────────────────────────────────────

const CheckoutSchema = z.object({
  shipping_name: z.string().min(3, "Ad soyad en az 3 karakter olmalıdır"),
  shipping_address: z.string().min(10, "Adres en az 10 karakter olmalıdır"),
  shipping_phone: z.string().min(10, "Telefon en az 10 karakter olmalıdır"),
  payment_method: z.enum(["credit_card", "debit_card"]),
  card_number: z
    .string()
    .regex(/^\d{16}$/, "Kart numarası 16 haneli rakam olmalıdır"),
  card_expiry: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, "Son kullanma tarihi MM/YY formatında olmalıdır"),
  card_cvv: z
    .string()
    .regex(/^\d{3,4}$/, "CVV 3 veya 4 haneli olmalıdır"),
});

// Sepet öğesi tipi — FormData'dan JSON olarak gelir
interface RawCartItem {
  productId: number;
  quantity: number;
}

// DB'den çekilen ürün satırı
interface ProductStockRow {
  id: number;
  price: number;
  stock: number;
}

// ── Sipariş oluştur ───────────────────────────────────────────────────────

export async function createOrderAction(
  formData: FormData
): Promise<{ success: boolean; error?: string; orderId?: number }> {
  // Oturum kontrolü
  const session = await getSession();
  if (!session.isLoggedIn || !session.user) {
    return { success: false, error: "Bu işlem için giriş yapmalısınız" };
  }

  // Sepet verisi FormData'dan JSON olarak alınır (client tarafından set edilir)
  let cartItems: RawCartItem[];
  try {
    cartItems = JSON.parse(formData.get("cartItems") as string) as RawCartItem[];
  } catch {
    return { success: false, error: "Sepet verisi okunamadı" };
  }

  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: "Sepetiniz boş" };
  }

  // Form alanlarını doğrula
  const parsed = CheckoutSchema.safeParse({
    shipping_name: formData.get("shipping_name"),
    shipping_address: formData.get("shipping_address"),
    shipping_phone: formData.get("shipping_phone"),
    payment_method: formData.get("payment_method"),
    card_number: formData.get("card_number"),
    card_expiry: formData.get("card_expiry"),
    card_cvv: formData.get("card_cvv"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const { shipping_name, shipping_address, shipping_phone, payment_method } =
    parsed.data;
  // Kart bilgileri DB'ye kaydedilmez — sadece doğrulama için kullanıldı

  const db = getDb();
  const userId = session.user.id;

  // Oturum token'ı geçerli olsa bile kullanıcı silinmiş olabilir
  const userExists = db
    .prepare("SELECT id FROM users WHERE id = ?")
    .get(userId);
  if (!userExists) {
    return {
      success: false,
      error: "Oturumunuz sona erdi, lütfen tekrar giriş yapın.",
    };
  }

  try {
    // Transaction: stok kontrolü → sipariş oluşturma → stok güncelleme
    const getProductStmt = db.prepare(
      "SELECT id, price, stock FROM products WHERE id = ?"
    );

    const orderId = db.transaction((): number => {
      let totalAmount = 0;
      const stockMap = new Map<number, ProductStockRow>();

      // Adım 1: Stok ve fiyat kontrolü
      for (const item of cartItems) {
        const row = getProductStmt.get(item.productId) as
          | ProductStockRow
          | undefined;

        if (!row) {
          throw new Error(`Ürün bulunamadı (id: ${item.productId})`);
        }
        if (row.stock < item.quantity) {
          throw new Error(`Yetersiz stok (ürün id: ${item.productId})`);
        }

        stockMap.set(item.productId, row);
        totalAmount += row.price * item.quantity;
      }

      // Adım 2: Siparişi kaydet
      const orderNumber = `ORD-${Date.now()}`;
      const orderResult = db
        .prepare(
          `INSERT INTO orders
             (user_id, order_number, total_amount, status,
              shipping_name, shipping_address, shipping_phone, payment_method)
           VALUES (?, ?, ?, 'pending', ?, ?, ?, ?)`
        )
        .run(
          userId,
          orderNumber,
          totalAmount,
          shipping_name,
          shipping_address,
          shipping_phone,
          payment_method
        );

      const newOrderId = Number(orderResult.lastInsertRowid);

      // Adım 3: Sipariş öğelerini kaydet ve stokları düş
      const insertItemStmt = db.prepare(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES (?, ?, ?, ?)`
      );
      const updateStockStmt = db.prepare(
        "UPDATE products SET stock = stock - ? WHERE id = ?"
      );

      for (const item of cartItems) {
        const row = stockMap.get(item.productId)!;
        insertItemStmt.run(newOrderId, item.productId, item.quantity, row.price);
        updateStockStmt.run(item.quantity, item.productId);
      }

      return newOrderId;
    })();

    return { success: true, orderId };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Sipariş oluşturulamadı";
    console.error("[createOrderAction] Hata:", error);
    return { success: false, error: message };
  }
}

// ── Kullanıcının siparişlerini getir ─────────────────────────────────────

export async function getUserOrders(): Promise<OrderWithItems[]> {
  const session = await getSession();
  if (!session.isLoggedIn || !session.user) return [];

  const db = getDb();

  const orders = db
    .prepare(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC"
    )
    .all(session.user.id) as Order[];

  // Ürün adı ve görseli için products tablosuyla JOIN
  const getItemsStmt = db.prepare(`
    SELECT
      oi.id, oi.order_id, oi.product_id, oi.quantity, oi.unit_price,
      p.name  AS product_name,
      p.image_url AS product_image
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `);

  return orders.map((order) => ({
    ...order,
    items: getItemsStmt.all(order.id) as OrderItem[],
  }));
}

// ── Tek sipariş detayı ────────────────────────────────────────────────────

export async function getOrderById(
  orderId: number
): Promise<OrderWithItems | null> {
  const session = await getSession();
  if (!session.isLoggedIn || !session.user) return null;

  const db = getDb();

  // Kullanıcı yalnızca kendi siparişini görebilir
  const order = db
    .prepare("SELECT * FROM orders WHERE id = ? AND user_id = ?")
    .get(orderId, session.user.id) as Order | undefined;

  if (!order) return null;

  // Ürün adı ve görseli için products tablosuyla JOIN
  const items = db
    .prepare(`
      SELECT
        oi.id, oi.order_id, oi.product_id, oi.quantity, oi.unit_price,
        p.name      AS product_name,
        p.image_url AS product_image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `)
    .all(orderId) as OrderItem[];

  return { ...order, items };
}
