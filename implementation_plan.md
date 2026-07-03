# Implementation Plan: Redesign Total & Penambahan Fitur Enterprise Analytics

Berdasarkan instruksi Anda, kita akan melakukan *redesign* dan perluasan besar-besaran untuk mengubah halaman Admin dari sekadar "Sistem Log" menjadi **Platform Analitik Profesional** kelas *Enterprise* (seperti Google Analytics / Mixpanel) yang 100% dibuat khusus secara manual (non-AI).

## Proposed Changes

### 1. Perubahan Struktur Folder & Pembersihan Skrip (Cleanup)
- **Hapus & Bersihkan:** Seluruh file/folder/gambar yang tidak terpakai dari iterasi sebelumnya akan dideteksi dan dihapus. (Misalnya file contoh lama, variabel CSS usang, atau skrip yang teronggok).
- **Hapus "Visitors" Sidebar:** Menghilangkan navigasi "Visitors" lama (yang sudah dikerjakan sebagian, tetapi akan kita hapus permanen hingga ke akarnya agar menyisakan menu terpadu).

### 2. Redesign Total (UI/UX)
Kita akan membangun antarmuka analitik yang mewah, *clean*, dan sangat natural bagi pengembang profesional:
- **Tema & Warna (Dark Mode):** Akan menggunakan *slate/zinc dark colors* dengan tipografi presisi (seperti Inter/Roboto) tanpa gradasi mencolok (anti AI-generated look).
- **Layout & Visual Hierarchy:**
  - **Sidebar:** Minimalis dengan menu "Dashboard", "Analytics", dan "Raw Logs".
  - **Header:** Tetap menyertakan indikator status sistem (Online/Offline) dan tombol Export.
  - **Dashboard Cards:** Grid statistik super rapi (angka tebal, label halus).

### 3. Penambahan Fungsionalitas & Metrik Analitik (`assets/js/admin.js`)
Skrip `admin.js` akan dirombak total untuk memproses ribuan data dari Supabase secara asinkron lalu dipecah menjadi perhitungan metrik yang akurat di sisi peramban.

#### A. Dashboard Overview (Statistik)
Sistem akan menghitung:
- **Total Visits (Sessions):** Dihitung berdasarkan `session_id` unik.
- **Total Unique Visitors:** Dihitung berdasarkan `visitor_id` unik.
- **Page Views & Clicks:** Total halaman yang dikunjungi dan klik.
- **Time-based Metrics:** Memisahkan data "Today", "This Week", dan "This Month".
- **Average Session Duration & Bounce Rate:** (Bounce rate = Sesi di bawah 10 detik atau tanpa klik).
- **Peak Traffic Hour:** Jam tersibuk dalam sehari.
- **Top / Least Page:** Halaman yang paling banyak/sedikit dikunjungi.

#### B. Analytics Charts
- **Traffic Over Time:** Grafik interaktif (menggunakan SVG buatan tangan atau Recharts/Chart.js ringan jika diizinkan, jika tidak kita bangun menggunakan CSS/SVG DOM agar murni tanpa *dependency* besar).
- **Distribusi Demografi:** Device Type (Desktop vs Mobile), Browser, OS.
- **Top Referrers & Geographic Analytics:** Menganalisis sumber trafik dan peta lokasi dari negara/kota.

#### C. Raw Logs
- Fitur *Sistem Logs* yang baru kita bangun sebelumnya akan dikapsulasi ke dalam menu/bagian **Raw Logs**.
- Tetap menyimpan data permanen (tanpa limit tampilan), *pagination*, pencarian kompleks, dan fitur *Export CSV*.
- Penambahan filter lanjutan untuk: Entry Page, Device, Referrer, dll.

## User Review Required

> [!IMPORTANT]
> **Pilihan Library Grafik (Charts):** Untuk mewujudkan fitur analitik (Daily/Weekly Chart, Device Analytics, dll) yang sekelas profesional, apakah Anda mengizinkan saya mengimpor **Chart.js** (library super ringan via CDN) ke dalam `admin.html`? Jika tidak diizinkan, saya akan membangun *bar chart* menggunakan elemen murni HTML/CSS yang dinamis, namun mungkin terbatas dalam interaktivitas detail seperti *hover tooltip* pada grafik melengkung.

> [!WARNING]
> Proses kalkulasi tingkat lanjut (seperti Unique Visitors, Bounce Rate, Returning Visitors) akan dilakukan secara penuh di sisi klien menggunakan JavaScript (`admin.js`). Saya akan mengoptimalkan algoritmanya agar tetap ringan dan dieksekusi kurang dari sekian milidetik setelah data terambil (limit 10.000).

## Open Questions

1. Apakah penggunaan library pihak ketiga seperti **Chart.js** via CDN diizinkan khusus untuk merender visualisasi data metrik? 
2. Dari sisi tata letak, apakah Anda ingin ketiga fitur ini (Overview, Analytics, Logs) disatukan dalam **satu halaman panjang** (single page scroll) atau dipisah menggunakan **tabulasi navigasi** di dalam dashboard (hanya me-render DOM tertentu ketika di-klik)?

## Verification Plan
- Kode dikembangkan secara ketat: `0` komentar HTML/CSS/JS, murni kode produksi.
- Uji beban (*stress test*) pemuatan dan penghitungan metrik dari `rawData`.
- Validasi tata letak responsif pada resolusi desktop dan mobile.
- Validasi fungsi *Bounce Rate* dan *Returning Visitor*.
