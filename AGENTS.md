# POS Mockup: aturan untuk agen AI

Repo ini berisi **mockup HTML** platform POS multi-vertikal (kasir untuk FnB, kost, retail, laundry, dst.). Mockup nanti di-slicing ke development. Design system **dipisah**: dipakai dari paket npm `@ordinara/*` (repo `dumns/ordinara`), bukan dibuat di sini.

Konteks produk ada di `docs/brainstorming/kategori.md`, `docs/brainstorming/role.md` (keputusan role dan level), dan `docs/proses/agile-flow.md`.

## Keputusan terkunci

1. **Dua lingkup terpisah.** Design system = repo Ordinara. Mockup = repo ini. Mockup tidak membuat komponen sendiri: tidak ada blok `<style>` komponen, kelas komponen buatan, atau SVG custom bila ikon `ori-*` tersedia. Butuh komponen atau varian baru: diminta dan dibuat di Ordinara dulu, rilis, lalu dipakai di sini.
2. **Versi mockup hanya tanggal** (`## YYYY-MM-DD` di `templates/CHANGELOG.md`), tanpa semver dan tanpa tag. Setiap tanggal menyebut "Dasar Ordinara: vX.Y.Z".
3. **Setiap perubahan dicatat di `templates/CHANGELOG.md`** pada tanggal hari itu, di commit yang sama.
4. **Mulai dari POV eksternal tertinggi (Owner)**, lalu turun ke Manager, Kasir, dan seterusnya. Role dan level mengikuti `docs/brainstorming/role.md`: Owner boleh membuat role kustom; role selevel tidak bisa saling akses, hanya level di atasnya.
5. **Satu halaman = satu file HTML.** Dilarang satu file multi-view yang berpindah lewat JS. Konten statis ditulis sebagai HTML.
6. **Interaktif hanya untuk demo.** Perilaku (tambah item, filter, modal, validasi, toast) ditulis di `assets/js/<halaman>.js` dengan data di memori halaman; markup tetap ada di HTML (pakai `<template>` untuk baris yang dibuat JS). Tanpa panggilan API, tanpa penyimpanan permanen, dan JS tidak boleh membuat gaya atau komponen baru. Helper bersama (rupiah, toast) ada di `assets/js/demo.js`.
7. **Nama produk `Kasira` adalah placeholder.** Jangan menyebut Ordinara atau pustaka lain di teks UI.

## Struktur

```
templates/<role>/       halaman per sudut pandang (owner/, manager/, kasir/, ...)
templates/CHANGELOG.md  riwayat mockup (tanggal)
src/input.css           entry Tailwind: mengimpor styles, font, dan ikon Ordinara
assets/js/*.js          skrip demo per halaman dan helper bersama (demo.js)
assets/js/vendor/       hasil salinan Flowbite (di-gitignore, dibuat saat build)
dist/                   hasil build (di-gitignore)
scripts/copy-vendor.mjs menyalin Flowbite dan font ke assets/ dan dist/
```

## Cara kerja

- `npm install`, lalu `npm run build` (atau `npm run dev` untuk watch). Sajikan dari akar repo lewat HTTP (`npm run serve`, port 5180); halaman memakai `<base href="/templates/<role>/">`, jadi jangan dibuka lewat `file://`.
- Setelah menambah kelas Tailwind baru, jalankan build ulang.
- Naikkan versi Ordinara: ubah di `package.json`, `npm install`, `npm run build`, periksa ulang semua halaman, catat "Dasar Ordinara" baru di changelog.

## Gaya (ikuti Ordinara dan preferensi tim)

- Flat: card `rounded-card border border-border/70 bg-surface`, **tanpa shadow**. Tanpa emoji, tanpa dekorasi tak berfungsi, simetris.
- Token, bukan nilai acak: `primary-*`, `neutral-*`, `fg`, `fg-muted`, `fg-subtle`, `border`, `rounded-control`, `rounded-card`. Judul pakai `font-display`. Dark mode lewat token, bukan `dark:` ad-hoc.
- Ikon: `<i class="ori ori-nama"></i>` (hanya ikon di `@ordinara/icons` mask, 220 nama).
- Tombol: satu basis `rounded-control font-semibold`, ukuran `h-8/h-10/h-12`; varian primary, outline, ghost, danger. Tanpa efek tambahan.
- Teks Indonesia, singkat, tanpa kapital semua, tanpa info redundan.
- Responsif 320 sampai desktop, tanpa scroll horizontal di level halaman. Tabel dibungkus `relative overflow-x-auto` (wajib `relative` agar `sr-only` tidak keluar dari wadah). Kolom kurang penting disembunyikan di mobile.

## Verifikasi sebelum menyatakan selesai

Buka halaman di browser pada 320, 390, 768, dan desktop. Periksa: tidak ada overflow horizontal, tidak ada galat konsol atau 404, hover/fokus berfungsi, drawer sidebar terbuka di mobile. Jangan melapor selesai dari build saja.

## Git

- **Commit, push, dan merge hanya atas perintah.** Persetujuan sebelumnya tidak berlaku untuk tindakan berikutnya.
- Pesan commit satu baris, tanpa deskripsi dan tanpa co-author. Stage per path, bukan `git add -A`. Folder `reference/` tidak di-commit.
- Branch mockup: `mockup/<YYYY-MM-DD>`. Jangan commit di `master`.
- Alur lengkap (commit, push, merge, staging, release, Vercel): skill `.claude/skills/kasira-release/SKILL.md`. Baca sebelum melakukan tindakan git apa pun.
