# 🐱 MeowKAS

> **Aplikasi Manajemen Keuangan Pribadi & Celengan Impian Berbasis 3D Neumorphism.**  
> 100% Offline-First, ringan, tanpa iklan, dan menjaga privasi data finansial Anda seutuhnya.

---

## 📱 Sekilas Tentang MeowKAS

**MeowKAS** adalah aplikasi pencatatan keuangan harian mandiri yang dirancang dengan antarmuka **3D Tactile Neumorphism** yang modern, bersih, dan memanjakan mata. MeowKAS dilengkapi dengan fitur celengan target barang, sistem evaluasi anggaran pintar, kalkulator terintegrasi, serta pengingat harian bersuara tegas agar Anda disiplin menabung.

Aplikasi ini bersifat **Offline-First**—seluruh riwayat pemasukan, pengeluaran, dan progres tabungan tersimpan langsung di memori perangkat Anda menggunakan **IndexedDB**. Tidak ada data finansial yang dikirim ke server pihak ketiga.

---

## ✨ Fitur Unggulan

### 1. 💵 Manajemen Kas & Siklus Gajian
* **Pencatatan Cepat:** Catat pemasukan dan pengeluaran lengkap dengan kategori dan catatan rincian.
* **Siklus Bulanan Dinamis:** Atur tanggal gajian / reset bulanan (misal setiap tanggal 1 atau 25).
* **Batas Anggaran Otomatis:** Bar persentase limit anggaran yang otomatis menyesuaikan total pendapatan siklus berjalan.
* **Peringatan Cicilan (H-3):** Banner pengingat otomatis untuk tagihan berkala yang mendekati tanggal jatuh tempo.
* **Nota Digital:** Rincian detail transaksi lengkap dengan stempel tanggal, jam, dan opsi penghapusan item.

### 2. 🎯 Celengan Impian & Pengingat Galak
* **Target Barang Masa Depan:** Buat celengan impian lengkap dengan target nominal dan foto barang dari galeri HP.
* **Hitung Mundur Dinamis:** Estimasi tanggal tercapainya target berdasarkan rencana setoran harian.
* **Quick Deposit:** Tombol setor instan (+Rp5.000, +Rp10.000, dst.) yang langsung memotong pencatatan kas secara otomatis.
* **Notifikasi Lokal Galak:** Fitur alarm notifikasi harian langsung di status bar HP (default pukul 13:00 WIB) yang mengingatkan Anda agar tidak jajan sembarangan saat target belum terpenuhi.

### 3. 📊 Evaluasi Finansial & Formula 60/20/10/10
* **Grafik Lingkaran Interaktif:** Visualisasi persentase pengeluaran per kategori berbasis Canvas HTML5.
* **Smart Allocation Calculator:** Masukkan nominal gaji bulanan untuk mendapatkan rekomendasi alokasi dana ideal:
  * **60%**: Kebutuhan Pokok
  * **20%**: Tabungan & Dana Darurat
  * **10%**: Keinginan Pribadi & Hiburan
  * **10%**: Sosial, Sedekah, atau Orang Tua

### 4. 🧮 Kalkulator Cepat Terintegrasi
* Hitung rincian belanjaan tanpa perlu keluar dari aplikasi.

### 5. 🎨 Personalisasi Tema 3D
* **Pilihan Preset:** Putih 3D, Hitam Elegan, Lembut Pink, dan Biru Laut.
* **Custom Color Picker:** Sesuaikan warna dasar latar serta saturasi bayangan gelap dan terangnya secara manual.
* **Slider Kecerahan:** Atur tingkat pencahayaan latar neumorphic.
* **Auto-Contrast:** Warna teks otomatis beralih hitam/putih menyesuaikan tingkat kecerahan latar belakang.

---

## 📥 Cara Mengunduh & Memasang APK

1. Masuk ke halaman repositori ini di GitHub.
2. Buka menu **Releases** di sisi kanan (atau gulir ke bawah pada tampilan ponsel).
3. Pilih rilis terbaru (**Latest Release**).
4. Unduh file **`app-debug.apk`**.
5. Buka file APK tersebut di HP Android Anda dan pilih **Pasang / Install** (izinkan *Install from unknown sources* jika diminta).

---

## 🛠️ Tumpukan Teknologi

* **Frontend:** HTML5, Vanilla JavaScript (ES6+), Tailwind CSS (CDN)
* **Penyimpanan Lokal:** IndexedDB API (Offline Storage)
* **Desain:** Pure CSS Custom 3D Neumorphism Box-Shadows
* **Native Runtime:** [Capacitor](https://capacitorjs.com/) (Android Bridge & Local Notifications)
* **Otomatisasi CI/CD:** GitHub Actions (Build otomatis ke APK Android)

---

## 🔒 Privasi Data

Data transaksi dan foto celengan Anda **100% tersimpan secara lokal** di dalam database peramban internal perangkat (IndexedDB). Menghapus cache atau data aplikasi dari menu Pengaturan akan membersihkan data tersebut secara permanen.
