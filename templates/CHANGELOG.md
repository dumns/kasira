# Changelog Mockup

Perubahan mockup platform POS (`templates/*`). Format [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), tetapi versinya **hanya tanggal** (`## YYYY-MM-DD`). Versi semver milik design system Ordinara, bukan repo ini.

Aturan singkat:
- Setiap perubahan dicatat di tanggal hari itu, di commit yang sama dengan perubahannya.
- Mockup memakai komponen Ordinara dan tidak membuat komponen sendiri. Butuh komponen atau varian baru: dibuat dulu di Ordinara.
- Setiap tanggal menyebut versi Ordinara yang dipakai ("Dasar Ordinara").
- Kelompok: Added / Changed / Fixed / Removed.

## 2026-10-31

Dasar Ordinara: v0.1.0

### Added

- **Fondasi repo mockup**: Tailwind v4 yang memakai `@ordinara/ui`, `@ordinara/tokens`, dan `@ordinara/icons` dari npm; build CSS ke `dist/output.css`; skrip penyalin Flowbite dan font; `AGENTS.md` berisi keputusan dan aturan kerja.
- **Sudut pandang Owner** (`templates/owner`), role eksternal tertinggi:
  - `onboarding-kategori.html`: pilih jenis usaha (12 kategori) yang menentukan fitur dan istilah.
  - `index.html`: dashboard (ringkasan penjualan, penjualan per jam, metode pembayaran, transaksi terbaru, status outlet) dengan sidebar, outlet switcher, dan drawer di mobile.
  - `peran.html`: daftar Tim & Peran dengan level (L1-L4), jenis (Bawaan/Kustom), jumlah pengguna, dan cakupan; catatan aturan bahwa peran selevel tidak saling akses.
  - `peran-baru.html`: pembuatan role kustom (nama, level, cakupan, permission per grup).

- **Halaman Transaksi Owner** (`templates/owner/transaksi.html`): riwayat transaksi semua outlet dengan pencarian, filter (periode, outlet, status, metode), tabel berstatus (Selesai, Menunggu bayar, Dibatalkan, Refund), dan pagination. Kolom menyesuaikan lebar layar: di mobile hanya No., Total, dan Status; Waktu, Pesanan, dan aksi muncul mulai `sm`; Outlet dan Pembayaran mulai `xl`; Kasir mulai `2xl`. Menu Transaksi di sidebar dan tautan "Lihat semua" di dashboard kini mengarah ke halaman ini.

- **Layar kasir Restoran & Kafe** (`templates/kasir/index.html`), dipakai bersama: Owner membukanya dari tombol **Kasir** di navbar dan kembali ke dashboard lewat menu Dashboard di dropdown profil. Layar penuh tanpa sidebar: pencarian menu, kategori, kartu menu dengan penanda jumlah, dan panel pesanan (Dine-in atau Take away, meja, jumlah per item, catatan, subtotal, pajak, total, Simpan, Bayar). Di layar sempit panel pesanan menjadi drawer dari kanan lewat tombol "4 item".

- **Mockup interaktif (demo, tanpa API)**: skrip per halaman di `assets/js` dengan helper bersama `demo.js` (rupiah, toast yang menumpuk dari atas ke bawah, sinkron outlet).
  - Kasir: tambah menu dengan klik, ubah jumlah di keranjang (hapus saat 0), filter kategori dan pencarian, Take away menonaktifkan meja, total dan pajak dihitung. Alur Bayar lewat modal: Tunai (uang diterima, tombol cepat, kembalian atau kurang), QRIS, Kartu, Transfer, layar berhasil dengan Cetak struk, lalu pesanan baru dengan nomor naik. Keranjang kosong menampilkan keadaan kosong dan menonaktifkan Bayar.
  - Transaksi: pencarian dan filter outlet, status, dan metode bekerja pada tabel, dengan keadaan kosong.
  - Dashboard: filter outlet dan periode mengubah ringkasan.
  - Tim & Peran: hapus peran lewat modal konfirmasi; peran baru dari formulir muncul di daftar.
  - Buat peran: validasi nama, petunjuk hak per level, Pilih semua per grup.
  - Sidebar: outlet aktif bisa diganti lewat dropdown dan tersinkron dengan filter halaman.

### Changed

- **Nomor invoice hanya muncul setelah pembayaran**: panel pesanan di layar kasir tidak lagi menampilkan "#INV-…" (judul "Pesanan" saja, dan toast Simpan tanpa nomor). Nomor tampil di layar struk setelah pembayaran berhasil, dan naik untuk transaksi berikutnya.
- **Layar kasir tanpa tombol kembali**: panah kembali di navbar dihapus; menu **Dashboard** ada di dropdown profil layar kasir.
- **Tombol Kasir pindah ke navbar** (semua halaman Owner): tombol utama di kiri profil, bukan lagi item di sidebar.
- **Profil pengguna pindah ke navbar** (semua halaman Owner dengan sidebar): avatar, nama, dan peran di kanan navbar (nama dan peran disembunyikan di mobile), dengan menu dropdown berisi identitas akun (nama dan email), Profil saya, Pengaturan akun, dan Keluar. Kartu pengguna di dasar sidebar dihapus.
- **Pencarian dan notifikasi dihapus dari navbar** untuk sementara.

### Fixed

- **Backdrop modal dan drawer tidak muncul**: Tailwind belum memindai JS Flowbite dari lokasi paket terpasang, sehingga kelas backdrop tidak dibuat. Ditambah `@source` ke `node_modules/flowbite` di `src/input.css`.
- **Server lokal membuang query string** (`?baru=...`) karena clean URLs; ditambah `serve.json` dengan `cleanUrls: false`.
- **Margin konten tidak simetris di layar lebar** (semua halaman Owner dengan sidebar): wadah konten tidak lagi dibatasi lebar maksimum, sehingga jarak kiri dan kanan sama (24px) di semua ukuran layar.
- **Scrollbar sidebar disembunyikan** (`scrollbar-none`): menu tetap bisa digulir.
