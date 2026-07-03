# Arafi Ramadhan Maulana - Portfolio & Analytics Dashboard

Ini adalah repositori untuk website portofolio profesional saya, lengkap dengan sistem pelacakan metrik analitik (dashboard admin) khusus. Proyek ini dibangun dari awal untuk merepresentasikan pengalaman, keterampilan, dan portofolio saya sebagai Data Scientist dan Full-Stack Developer.

Website ini berfokus pada performa, aksesibilitas, dan kemudahan dalam mengelola data analitik kunjungan.

## Fitur Utama

### 1. Website Portofolio (`/index.html`)
- **Desain Modern & Responsif:** Tampilan konsisten dan profesional di seluruh perangkat (mobile, tablet, desktop).
- **Efek Partikel Interaktif:** Menggunakan partikel kanvas ringan untuk latar belakang hero yang tidak memberatkan performa.
- **GSAP Animations:** Animasi scroll dan transisi elemen yang mulus di berbagai bagian (GSAP & ScrollTrigger).
- **Proyek & Riwayat Pekerjaan:** Katalog dinamis yang berisi rincian pekerjaan dan sertifikasi.
- **Formulir Kontak (Terintegrasi ke Formspree):** Pengunjung dapat langsung mengirim pesan yang terhubung ke email tanpa memerlukan backend khusus.
- **Tracker Pengunjung Kustom:** Skrip pemantauan ringan (frontend tracker) yang merekam IP, lokasi, device, dan durasi sesi yang dikirim secara asinkron ke database.

### 2. Dashboard Analitik Admin (`/admin.html`)
- **Keamanan:** Dilengkapi sistem *password gate* dengan hashing lokal (SHA-256) untuk mencegah akses tidak sah.
- **Visualisasi Tren Trafik:** Grafik bar yang dibangun secara native untuk memantau trafik pengunjung dalam 7 hari terakhir.
- **Filter & Pencarian:** Fitur penyaringan data langsung (by device, search bar) yang sangat responsif.
- **Ekspor Data ke CSV:** Mampu mengekspor seluruh log data pelacakan yang ada ke dalam format CSV untuk diaudit secara luring.
- **Sistem Status:** Indikator *Online/Offline* sistem yang memonitor ketersediaan jaringan secara real-time.

## Struktur Folder

```text
portofolio/
├── index.html            # Halaman utama portofolio
├── admin.html            # Halaman admin dashboard (membutuhkan password)
├── assets/
│   ├── css/
│   │   ├── admin.css     # Styling khusus dashboard admin
│   │   └── portfolio.css # Styling utama portofolio (variabel, layout, animasi)
│   ├── js/
│   │   ├── admin.js      # Logika otentikasi admin, fetch data Supabase, dan interaksi dashboard
│   │   ├── script.js     # Logika animasi frontend (GSAP, canvas, form handling)
│   │   └── tracker.js    # Skrip background pelacak sesi pengunjung 
│   └── images/           # Aset gambar, sertifikat, dan tangkapan layar proyek
└── vercel.json           # Konfigurasi routing dan HTTP headers untuk Vercel
```

## Teknologi yang Digunakan

Proyek ini dibuat menggunakan teknologi fundamental web agar tetap modular, sangat cepat, dan mudah dipelihara.

- **Frontend Core:** HTML5, CSS3 murni (tanpa framework), Vanilla JavaScript.
- **Animasi:** GSAP (GreenSock Animation Platform).
- **Ikonography:** Lucide Icons.
- **Database & API:** Supabase (PostgreSQL & REST API) untuk menyimpan data tracking analitik secara terpusat.
- **Hosting:** Vercel (CI/CD otomatis dari GitHub).

## Cara Menjalankan Project (Local Development)

Proyek ini tidak memerlukan *build tools* rumit (seperti Webpack/Vite) atau *bundler* apa pun. Cukup jalankan *local server* pada folder utama repositori.

1. Clone repositori ini:
   ```bash
   git clone https://github.com/arafiramadhanmaulana/portofolio.git
   ```
2. Masuk ke folder proyek:
   ```bash
   cd portofolio
   ```
3. Gunakan *live server* atau *http.server* bawaan Python:
   ```bash
   python -m http.server 3000
   ```
   Atau jika menggunakan ekstensi VS Code, Anda bisa langsung klik **"Go Live"**.
4. Buka browser dan arahkan ke `http://localhost:3000`.

*Catatan:* Karena fitur form dan tracking terhubung langsung ke API pihak ketiga, pastikan koneksi internet aktif agar fungsionalitas tersebut dapat diuji.

## Deployment

Proyek ini di-*deploy* melalui **Vercel** secara otomatis di setiap kali terdapat pembaruan (*push*) ke *branch* utama di GitHub.
File konfigurasi `vercel.json` telah disiapkan untuk memastikan setiap akses *route* (seperti `/admin`) tertangani dengan aman dan efisien, termasuk integrasi header khusus bila perlu.

## Informasi Kontak

Jika Anda memiliki pertanyaan teknis, peluang kolaborasi, atau butuh bantuan lebih lanjut, silakan hubungi saya melalui:

- **Website:** [https://arafiramadhanmaulana.vercel.app](https://arafiramadhanmaulana.vercel.app)
- **LinkedIn:** [Arafi Ramadhan Maulana](https://www.linkedin.com/in/arafi-ramadhan-maulana/)
- **GitHub:** [@arafiramadhanmaulana](https://github.com/arafiramadhanmaulana)
