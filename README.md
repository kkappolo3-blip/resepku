# Resepku — by Gibikey Studio

Aplikasi web untuk menemukan resep masakan Indonesia berdasarkan bahan yang kamu punya di dapur. Didukung AI.

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Backend: Cloud (Supabase + Edge Functions)
- AI: Google Gemini

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

## Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Import project ke [Vercel](https://vercel.com/new).
3. Vercel akan otomatis mendeteksi Vite (lihat `vercel.json`).
4. Tambahkan environment variables berikut di **Project Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`

   Nilainya bisa dilihat di file `.env` lokal.
5. Klik **Deploy**.

SPA routing sudah dikonfigurasi via `vercel.json`.

---

© Gibikey Studio
