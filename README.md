# TechStore — E-Ticaret Uygulaması

## 🚀 Canlı Demo

[Canlı Demo](https://ffwd-e-commerce-project.vercel.app)

## 📹 Proje Tanıtım Videosu

[Video Linki](https://www.youtube.com/watch?v=x7mlaNiMTHk)

## 📖 Proje Hakkında

MultiAcademy React Foundations bootcamp mezuniyet projesi.
Next.js ile geliştirilmiş tam işlevli bir e-ticaret uygulaması.
Kullanıcı kaydı, giriş, ürün listeleme, sepet ve sipariş yönetimi içerir.

## ✨ Özellikler

- Kullanıcı kayıt ve giriş sistemi (iron-session)
- Ürün listeleme, arama, filtreleme ve sıralama
- Alışveriş sepeti (localStorage ile kalıcı)
- Checkout ve simüle ödeme sistemi
- Sipariş geçmişi ve detay sayfaları
- Korumalı sayfalar (middleware)
- Responsive tasarım

## 🛠️ Kullanılan Teknolojiler

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- SQLite (better-sqlite3)
- iron-session
- bcryptjs
- Zod
- Vercel (deployment)

## 🗂️ Proje Yapısı

```
src/
├── app/          # Next.js App Router sayfaları
├── components/   # Yeniden kullanılabilir componentler
├── lib/          # Veritabanı, session, server actions
├── types/        # TypeScript tip tanımları
├── hooks/        # Custom React hooks
└── context/      # Context providers
```

## 🚀 Kurulum

**Gereksinimler:** Node.js 18+

```bash
git clone https://github.com/oznc10/ffwd-e-commerce-project.git
cd ffwd-e-commerce-project
npm install
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini aç.

## 👤 Demo Hesap

Kayıt ol sayfasından yeni hesap oluşturabilirsiniz: `/register`

Test için örnek bilgiler:

- **Email:** test@test.com
- **Şifre:** 123456

## 📝 Lisans

Bu proje MultiAcademy React Foundations mezuniyet projesi olarak geliştirilmiştir.
