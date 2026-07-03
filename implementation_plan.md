# Refactoring Admin Dashboard menjadi Activity Logs System

Dashboard admin saat ini dirancang untuk memantau "Visitors" dengan berbagai grafik dan metrik. Sesuai instruksi Anda, kita akan menghapus seluruh fitur analitik "Visitors" dan memfokuskan dashboard murni sebagai **Sistem Log Aktivitas (Activity Logs System)**.

## Proposed Changes

### Komponen yang akan Dihapus (Hapus Fitur Visitors)
- **admin.html:**
  - Hapus `<div class="metrics-grid">` (Total Visitors, Visitors Today, dll).
  - Hapus grafik "Traffic Trends".
  - Hapus "Recent Activity Feed".
  - Ubah judul tabel dari "Visitor Logs" menjadi "Activity Logs".
- **assets/js/admin.js:**
  - Hapus fungsi `renderMetrics()`, `renderChart()`, dan `renderFeed()`.
  - Hapus pemanggilan fungsi-fungsi tersebut dan bersihkan state/variabel terkait (seperti perhitungan `todayCount`).
- **assets/css/admin.css:**
  - Hapus CSS yang berkaitan dengan `.metric-card`, `.chart-bar`, `.feed-item`, dll yang sudah tidak terpakai.

### Komponen yang akan Ditambahkan / Diubah (Sistem Logs)
- **admin.html:**
  - Tambahkan komponen pagination di bawah tabel (tombol Prev, Next, dan indikator halaman).
  - Perluas area `filters-bar` untuk mencakup filter tambahan:
    - Search by IP, city, device, atau keyword (sudah ada di topbar, akan kita pertahankan/optimalkan).
    - Date picker (untuk menyaring berdasarkan tanggal).
  - Tambahkan elemen untuk menampilkan "Total Logs" di bagian header tabel.
  - Tambahkan Modal/Popup statis di HTML untuk fitur "Melihat detail log" (dikontrol dengan JS).
- **assets/js/admin.js:**
  - **Penghapusan Batas:** Ubah `filteredData.slice(0, 20)` menjadi sistem pagination dinamis (misalnya 20 logs per halaman).
  - **API Fetch:** Pastikan URL fetch ke Supabase tidak dibatasi secara default atau kita eksplisit meminta limit besar `&limit=10000` agar semua histori log tersimpan dan bisa diakses.
  - **Filter Logic:** Update `applyFilters()` agar mendukung filter rentang tanggal.
  - **Detail View:** Tambahkan event listener pada setiap baris (row) tabel. Saat diklik, akan muncul Modal/Popup yang berisi rincian lengkap dari log tersebut (termasuk durasi, klik, OS, dll).
  - **Pagination Logic:** Buat state `currentPage`, tombol untuk pindah halaman, dan render tabel sesuai halaman aktif.

## User Review Required

> [!IMPORTANT]
> **Data Fetching:** Saat ini data di-fetch sekaligus (client-side pagination). Jika data Anda sangat besar (lebih dari ribuan), metode ini tetap akan mengambil maksimal 1000-10000 data dari Supabase di awal sesuai batas API. Untuk saat ini, saya akan mengatur `limit=10000` dan melakukan filter/pagination di sisi klien agar sangat cepat. Apakah pendekatan ini sesuai?

> [!WARNING]
> Dengan dihapusnya *Traffic Trends* dan *Metrics Grid*, tampilan dashboard utama Anda akan didominasi oleh panel Tabel (Activity Logs) yang lebar. Layout akan dirapikan agar tampak profesional, elegan, dan fokus penuh pada data log (seperti antarmuka admin *database*).

## Open Questions

1. **Detail Log:** Pada tampilan detail log, informasi spesifik apa yang harus ditekankan? (Misalnya: IP, Lokasi, Device, Durasi Sesi, dan interaksi *click*).
2. **Export Logs:** Fitur Export CSV sudah ada di *topbar*. Apakah Anda ingin fitur ini dipertahankan di *topbar* atau dipindah berdekatan dengan tabel Log?

## Verification Plan

### Manual Verification
- Membuka halaman `/admin.html`.
- Mengisi kata sandi.
- Memastikan dashboard hanya menampilkan sistem logs (tabel) yang mengisi ruang secara proporsional.
- Menguji fitur pagination (Next/Prev).
- Menguji filter tanggal dan *search box*.
- Menekan salah satu baris log untuk memastikan Modal/Popup Detail Log muncul dan menampilkan informasi dengan benar.
- Mengekspor data ke CSV.
- Memastikan tidak ada komentar atau *dead code* di `admin.html`, `admin.js`, maupun `admin.css`.
