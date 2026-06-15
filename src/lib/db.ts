// SQLite veritabanı bağlantısı ve şema kurulumu
import Database from "better-sqlite3";
import path from "path";

// Vercel production ortamında /tmp yazılabilir tek dizindir
const DB_PATH =
  process.env.NODE_ENV === "production"
    ? "/tmp/database.sqlite"
    : path.join(process.cwd(), "database.sqlite");

// Singleton pattern: uygulama boyunca tek bir db instance'ı kullanılır
let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    // Yabancı anahtar kısıtlamalarını etkinleştir
    db.pragma("foreign_keys = ON");
    // WAL modu performansı artırır
    db.pragma("journal_mode = WAL");
  }
  return db;
}

// Tüm tabloları oluşturan SQL şeması
const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT    NOT NULL,
    email        TEXT    NOT NULL UNIQUE,
    password_hash TEXT   NOT NULL,
    role         TEXT    NOT NULL DEFAULT 'user',
    created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    slug        TEXT    NOT NULL UNIQUE,
    description TEXT,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    description TEXT,
    price       REAL    NOT NULL,
    stock       INTEGER NOT NULL DEFAULT 0,
    image_url   TEXT,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    is_featured INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id          INTEGER NOT NULL REFERENCES users(id),
    order_number     TEXT    NOT NULL UNIQUE,
    total_amount     REAL    NOT NULL,
    status           TEXT    NOT NULL DEFAULT 'pending',
    shipping_name    TEXT    NOT NULL,
    shipping_address TEXT    NOT NULL,
    shipping_phone   TEXT    NOT NULL,
    payment_method   TEXT    NOT NULL,
    created_at       TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at       TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id   INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity   INTEGER NOT NULL,
    unit_price REAL    NOT NULL
  );
`;

// Başlangıç verileri - tablolar boşsa eklenir
function seedDatabase(database: Database.Database): void {
  const categoryCount = (
    database.prepare("SELECT COUNT(*) as count FROM categories").get() as {
      count: number;
    }
  ).count;

  if (categoryCount > 0) return; // Zaten seed yapılmış

  // Kategori verilerini ekle
  const insertCategory = database.prepare(
    "INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)"
  );

  insertCategory.run(
    "Bilgisayar & Laptop",
    "bilgisayar-laptop",
    "Dizüstü bilgisayarlar, masaüstü sistemler ve aksesuarlar"
  );
  insertCategory.run(
    "Telefon & Tablet",
    "telefon-tablet",
    "Akıllı telefonlar, tabletler ve mobil aksesuarlar"
  );
  insertCategory.run(
    "Aksesuar & Çevre Birimleri",
    "aksesuar-cevre-birimleri",
    "Kulaklık, klavye, fare, monitör ve diğer çevre birimleri"
  );

  // Ürün verilerini ekle
  const insertProduct = database.prepare(`
    INSERT INTO products (name, description, price, stock, image_url, category_id, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const products: [string, string, number, number, string, number, number][] =
    [
      // Bilgisayar & Laptop (category_id: 1)
      [
        "MacBook Pro 14\" M3",
        "Apple M3 çipiyle güçlendirilen MacBook Pro 14\", profesyonel kullanıcılar için üstün performans sunar. Liquid Retina XDR ekranı ve 18 saate varan pil ömrüyle her yerde verimli çalışmanızı sağlar.",
        54999,
        15,
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
        1,
        1,
      ],
      [
        "MacBook Air 15\" M2",
        "M2 çipli MacBook Air 15\", ince ve hafif tasarımıyla günlük kullanım için ideal bir tercihtir. Fanless mimarisi sayesinde sessiz çalışırken etkileyici bir performans ortaya koyar.",
        42999,
        20,
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
        1,
        1,
      ],
      [
        "Dell XPS 15",
        "Dell XPS 15, Intel Core i7 işlemcisi ve NVIDIA GeForce RTX ekran kartıyla yaratıcı profesyonellere yönelik üretilmiştir. 15.6 inç OLED dokunmatik ekranı renkleri mükemmel biçimde yansıtır.",
        38999,
        12,
        "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800",
        1,
        0,
      ],
      [
        "ASUS ROG Strix G16",
        "ASUS ROG Strix G16, AMD Ryzen 9 işlemcisi ve RTX 4070 ekran kartıyla oyun dünyasında fark yaratır. 165Hz yenileme hızlı ekranı ve gelişmiş soğutma sistemiyle uzun oyun seanslarında performansı sabit tutar.",
        44999,
        8,
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
        1,
        0,
      ],
      [
        "Lenovo ThinkPad X1 Carbon",
        "Lenovo ThinkPad X1 Carbon, kurumsal kullanıcılar için tasarlanmış hafif ve dayanıklı bir iş bilgisayarıdır. MIL-SPEC sertifikasıyla zorlu koşullara dayanıklılığını kanıtlamış, Intel Core Ultra işlemcisiyle yüksek verimlilik sunar.",
        35999,
        10,
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
        1,
        0,
      ],
      // Telefon & Tablet (category_id: 2)
      [
        "iPhone 15 Pro",
        "iPhone 15 Pro, A17 Pro çipiyle akıllı telefon performansını yeni bir seviyeye taşıyor. Titanyum gövdesi, 48MP ana kamera sistemi ve Action Button özelliğiyle kullanım deneyimini kişiselleştirmenize olanak tanır.",
        44999,
        25,
        "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800",
        2,
        1,
      ],
      [
        "Samsung Galaxy S24 Ultra",
        "Samsung Galaxy S24 Ultra, entegre S Pen kalemi ve 200MP kamerası ile üretkenliği ve yaratıcılığı bir araya getirir. Snapdragon 8 Gen 3 işlemcisi, yapay zeka destekli özelliklerle kullanıcı deneyimini zenginleştirir.",
        39999,
        18,
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800",
        2,
        1,
      ],
      [
        "iPad Pro 12.9\"",
        "iPad Pro 12.9\", M2 çipi ve Liquid Retina XDR ekranıyla profesyonel içerik üreticileri için güçlü bir araçtır. Apple Pencil 2 ve Magic Keyboard desteğiyle dizüstü bilgisayar deneyimi sunar.",
        28999,
        15,
        "https://images.unsplash.com/photo-1544244015-0df4512b09f8?w=800",
        2,
        0,
      ],
      [
        "Samsung Galaxy Tab S9",
        "Samsung Galaxy Tab S9, Dynamic AMOLED 2X ekranı ve IP68 su direnciyle premium bir tablet deneyimi yaşatır. DeX modu sayesinde masaüstü bilgisayar gibi kullanılabilir.",
        18999,
        12,
        "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800",
        2,
        0,
      ],
      [
        "Google Pixel 8 Pro",
        "Google Pixel 8 Pro, Tensor G3 çipi ve yapay zeka destekli kamera özellikleriyle fotoğrafçılığı yeniden tanımlıyor. Garantili 7 yıl Android güncellemesi ve saf Android deneyimi sunar.",
        22999,
        10,
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
        2,
        0,
      ],
      // Aksesuar & Çevre Birimleri (category_id: 3)
      [
        "Sony WH-1000XM5",
        "Sony WH-1000XM5, sektörün en iyi aktif gürültü engelleme teknolojisiyle sessiz bir dinleme ortamı yaratır. 30 saate varan pil ömrü ve Multipoint bağlantı özelliğiyle birden fazla cihaza aynı anda bağlanabilirsiniz.",
        7499,
        30,
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
        3,
        1,
      ],
      [
        "Apple AirPods Pro 2",
        "Apple AirPods Pro 2, H2 çipiyle 2x daha güçlü aktif gürültü engelleme ve Adaptive Transparency modu sunar. MagSafe şarj kutusu sayesinde 30 saate kadar toplam pil ömrü elde edebilirsiniz.",
        6999,
        40,
        "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800",
        3,
        0,
      ],
      [
        "Logitech MX Master 3S",
        "Logitech MX Master 3S, elektromanyetik MagSpeed kaydırma tekerleği ve 8K DPI hassasiyetiyle güç kullanıcılarına yönelik tasarlanmıştır. USB-C şarj desteği ve birden fazla cihaz arasında sorunsuz geçiş imkânı sunar.",
        2499,
        35,
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
        3,
        0,
      ],
      [
        "Samsung 27\" 4K Monitor",
        "Samsung 27\" 4K monitör, IPS paneli ve %99 sRGB renk gamı ile fotoğraf ve video editörlerine profesyonel bir çalışma alanı sunar. USB-C bağlantısı sayesinde dizüstü bilgisayarınızı hem şarj edip hem de görüntü aktarabilirsiniz.",
        8999,
        20,
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
        3,
        0,
      ],
      [
        "Keychron K2 Mekanik Klavye",
        "Keychron K2, kompakt 75% yerleşimi ve Gateron G Pro anahtarlarıyla hem yazılım geliştiricilere hem de oyunculara hitap eder. Bluetooth ve USB-C bağlantı seçenekleri ile Windows ve macOS uyumlu çalışır.",
        2999,
        25,
        "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800",
        3,
        0,
      ],
    ];

  // Tüm ürünleri tek bir transaction içinde ekle (performans için)
  const insertAll = database.transaction(() => {
    for (const product of products) {
      insertProduct.run(...product);
    }
  });

  insertAll();
  console.log(
    `[DB] Seed tamamlandı: 3 kategori, ${products.length} ürün eklendi.`
  );
}

// Veritabanını başlat: şemayı oluştur ve seed datayı ekle
export function initializeDatabase(): void {
  try {
    const database = getDb();

    // Tüm tabloları oluştur
    database.exec(SCHEMA);
    console.log("[DB] Şema başarıyla oluşturuldu.");

    // Başlangıç verilerini ekle
    seedDatabase(database);
  } catch (error) {
    console.error("[DB] Veritabanı başlatma hatası:", error);
    throw error;
  }
}

// Modül yüklendiğinde veritabanını otomatik olarak başlat
initializeDatabase();
