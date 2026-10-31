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

### Changed

- **Profil pengguna pindah ke navbar** (semua halaman Owner dengan sidebar): avatar, nama, dan peran di kanan navbar (nama dan peran disembunyikan di mobile), dengan menu dropdown berisi identitas akun (nama dan email), Profil saya, Pengaturan akun, dan Keluar. Kartu pengguna di dasar sidebar dihapus.
- **Pencarian dan notifikasi dihapus dari navbar** untuk sementara.

### Fixed

- **Margin konten tidak simetris di layar lebar** (semua halaman Owner dengan sidebar): wadah konten tidak lagi dibatasi lebar maksimum, sehingga jarak kiri dan kanan sama (24px) di semua ukuran layar.
- **Scrollbar sidebar disembunyikan** (`scrollbar-none`): menu tetap bisa digulir.
