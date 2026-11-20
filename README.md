# Solitaire Recorder V1

Aplikasi desktop Windows untuk memainkan Klondike Solitaire Draw 1 dan merekam pola permainan.

## Fitur V1
- Permainan Klondike Draw 1 dengan 52 kartu.
- Gerakan tableau dan foundation, stok, waste, dan urungkan langkah.
- Pencatatan pola kartu terbuka/tertutup beserta identitas kartu.
- Menyimpan permainan selesai dan belum selesai secara lokal.
- Daftar dan hapus pola yang tersimpan.

## Persyaratan
- Windows 10/11
- Node.js 20 LTS atau lebih baru
- npm

## Menjalankan dari source
1. Instal Node.js.
2. Clone repository ini.
3. Buka folder proyek di Command Prompt/PowerShell.
4. Jalankan:

```bash
npm install
npm run check
npm start
```

## Penyimpanan lokal
Pola permainan disimpan pada file JSON di direktori userData Electron (bukan hanya di memori aplikasi). Lokasi persis mengikuti direktori data aplikasi Windows.

## Supabase
Skema database ada di `supabase/migrations/20261120000100_create_solitaire_patterns.sql`.
Tabel `public.solitaire_patterns` telah dibuat pada project Supabase terkait dan dilindungi RLS per pengguna.

**Catatan:** V1 saat ini belum mengirim/sinkronkan data permainan dari aplikasi desktop ke Supabase. Penyimpanan yang aktif di aplikasi adalah lokal. Sinkronisasi akun memerlukan login Supabase Auth dan publishable key; jangan pernah memasukkan service-role/secret key ke aplikasi desktop.

## Batasan V1
- Belum ada pembacaan pola dari screenshot/game eksternal (OCR).
- Belum ada solver otomatis yang menjamin semua permainan dapat diselesaikan.
- Belum ada panduan langkah otomatis berbasis pencocokan pola; fitur tersebut menjadi tahap pengembangan berikutnya.
- Ini merupakan permainan internal aplikasi, bukan pengendali game Solitaire pihak ketiga.

## Struktur
- `src/main.js` — proses utama Electron dan penyimpanan lokal.
- `src/preload.js` — jembatan IPC yang dibatasi.
- `src/game.js` — aturan permainan.
- `src/renderer.js` — antarmuka dan pencatatan.
- `supabase/migrations/` — skema database dan RLS.
