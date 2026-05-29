# 🚀 Premium Animated Portfolio Website - Arafi Ramadhan Maulana

Situs portofolio pribadi premium dengan arsitektur interaktif dan desain *glassmorphic* modern. Dibangun menggunakan teknologi web murni untuk performa pemuatan super cepat, ramah SEO, dan didukung sistem animasi berkelas dunia.

Situs ini dikustomisasi penuh berdasarkan latar belakang akademik Anda di **Sains Data ITERA**, serta pengalaman profesional Anda di **TELKOMSEL** dan **eBdesk Teknologi**.

---

## ✨ Fitur Utama & Keunggulan
- **Split-Gate Opening Entrance**: Pintu geser pembuka (*preloader curtain*) dengan bilah persentase kemajuan pemuatan ketika situs pertama kali dibuka.
- **Ambient Glowing Backdrops**: Pendaran cahaya gradasi dinamis lambat di latar belakang obsidian gelap yang memberi kesan premium dan futuristik.
- **Lenis Inertial Smooth Scrolling**: Sistem gulir halaman yang sangat lembut dan memiliki efek inersia untuk kenyamanan membaca tinggi.
- **Magnetic Navigation Pills**: Efek pil melayang pada menu header desktop maupun menu mobile bawah yang bergeser mengikuti menu aktif secara elastis menggunakan **GSAP & ScrollTrigger**.
- **Interactive Custom Cursor**: Kursor khusus berbentuk lingkaran ganda yang membesar dan berubah warna saat diarahkan ke elemen tombol, kartu, atau tautan.
- **Typing Rotating Subtitles**: Efek ketik dinamis bergantian pada subjudul hero utama ("Data Scientist", "Full-Stack Web Developer", "AI Practitioner").
- **Dynamic Category Filter**: Efek transisi pemfilteran karya/portofolio yang bergulir dan memudar secara halus menggunakan akselerasi perangkat keras GSAP.
- **Responsive Timelines**: Perpindahan tab visual antara *Pengalaman Kerja* dan *Pengalaman Organisasi* dengan titik penunjuk waktu adaptif.
- **Active Contact Redirect**: Pengisian formulir kontak yang terintegrasi langsung dengan pemformatan otomatis pengiriman pesan ke **WhatsApp** dan email Anda.

---

## 📂 Struktur Berkas
```bash
portofolio/
├── index.html   # Struktur Semantik HTML5, CDN CDNs, Konten LinkedIn & CV
├── style.css    # Sistem Desain CSS, Variabel HSL, Animasi Keyframes, Layar Responsif
└── script.js    # Logika Interaktif, GSAP Timelines, Cursor, Lenis, dan Form WhatsApp
```

---

## 🛠️ Cara Menjalankan Secara Lokal

Situs ini dibuat menggunakan *Vanilla Stack* murni tanpa memerlukan kompilasi rumit, sehingga Anda dapat langsung menjalankannya dengan cara:

### Cara 1: Langsung Buka di Browser
1. Masuk ke folder `portofolio/` Anda.
2. Klik dua kali pada file `index.html`.
3. Halaman akan langsung terbuka di browser favorit Anda!

### Cara 2: Menggunakan VS Code Live Server (Sangat Direkomendasikan)
1. Buka folder `portofolio/` di aplikasi **VS Code**.
2. Instal ekstensi **Live Server** (oleh Ritwick Dey) jika belum terinstal.
3. Klik tombol **Go Live** di sudut kanan bawah VS Code.
4. Situs akan berjalan di `http://127.0.0.1:5500` dengan fitur *hot-reload* otomatis setiap kali Anda mengubah kode.

### Cara 3: Menggunakan Server Lokal Python
Jika Anda memiliki Python terinstal di komputer, jalankan perintah berikut di PowerShell atau Command Prompt pada direktori proyek:
```bash
python -m http.server 8000
```
Lalu buka alamat `http://localhost:8000` di web browser Anda.

---

## 🚀 Cara Penyebaran (Deployment) ke Internet

Situs web berbasis statis ini sangat mudah diunggah secara **GRATIS** ke internet agar dapat diakses oleh perekrut (*recruiter*) melalui berbagai layanan:

### 1. GitHub Pages (Paling Mudah)
1. Buat sebuah repositori baru di akun GitHub Anda (misal: `portofolio`).
2. Unggah file `index.html`, `style.css`, dan `script.js` ke repositori tersebut.
3. Buka tab **Settings** repositori Anda -> pilih menu **Pages** di sebelah kiri.
4. Pada opsi *Build and deployment*, pilih branch `main` (atau `master`) dan folder `/ (root)`, lalu klik **Save**.
5. Dalam beberapa menit, portofolio Anda akan aktif di `https://username-anda.github.io/repositori-anda/`.

### 2. Vercel / Netlify
1. Masuk ke situs [Vercel](https://vercel.com) atau [Netlify](https://www.netlify.com).
2. Hubungkan dengan akun GitHub Anda.
3. Pilih repositori portofolio ini, lalu klik **Deploy** tanpa perlu melakukan pengaturan build command apa pun.
4. Situs Anda akan langsung memiliki domain `.vercel.app` atau `.netlify.app` gratis dalam hitungan detik!
