# POS Mockup

Mockup HTML platform kasir multi-vertikal (FnB, kost, retail, laundry, dst.) untuk di-slicing ke development. Memakai design system [Ordinara](https://github.com/dumns/ordinara) lewat paket npm `@ordinara/*`.

## Menjalankan

```bash
npm install
npm run build     # menghasilkan dist/output.css, dist/fonts, assets/js/vendor
npm run serve     # http://localhost:5180
```

Buka `http://localhost:5180/` untuk daftar mockup. Untuk mode watch CSS: `npm run dev`.

## Isi

| Path | Isi |
|---|---|
| `templates/owner/` | Mockup sudut pandang Owner (role eksternal tertinggi) |
| `templates/CHANGELOG.md` | Riwayat mockup per tanggal |
| `docs/brainstorming/kategori.md` | Kategori usaha yang dilayani |
| `docs/brainstorming/role.md` | Role internal dan eksternal, level, role kustom |
| `docs/proses/agile-flow.md` | Alur Agile dan rencana sprint |
| `AGENTS.md` | Aturan kerja untuk agen AI dan kontributor |

## Prinsip

- Design system dan mockup terpisah: komponen hidup di Ordinara, mockup hanya memakainya.
- Versi mockup hanya tanggal; setiap perubahan dicatat di `templates/CHANGELOG.md`.
- Satu halaman satu file HTML, tanpa logika aplikasi.
