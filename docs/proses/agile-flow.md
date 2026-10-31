# Agile Flow untuk Platform POS Multi-Vertikal

Dokumen ini berisi apa saja yang perlu disiapkan (artefak, peran, ritual, dan aturan kerja) untuk membangun platform dengan alur Agile (Scrum, dengan opsi Kanban).

## 1. Peran Tim

| Peran | Tugas | Catatan untuk proyek ini |
|---|---|---|
| Product Owner (PO) | Pemilik visi dan backlog, menentukan prioritas | Memutuskan kategori dan fitur gelombang 1 |
| Scrum Master | Menjaga proses, menyingkirkan hambatan | Bisa dirangkap lead engineer di tim kecil |
| Development Team | Desain, coding, testing | Backend, frontend/mobile, QA, UI/UX |
| Stakeholder | Memberi masukan dan menerima hasil | Calon pelanggan dari tiap vertikal |

Tim kecil: PO + 1 dev lead sebagai SM + 2-4 developer + 1 desainer + 1 QA (boleh paruh waktu).

## 2. Artefak yang Perlu Dibuat

### Fase Persiapan (sebelum sprint pertama)
1. **Product Vision / Product Brief**: masalah yang diselesaikan, target pengguna, pembeda dari kompetitor.
2. **Persona & Customer Journey**: minimal untuk Owner, Kasir, dan satu pelanggan akhir (mis. penghuni kost).
3. **Product Backlog**: daftar semua kebutuhan, diurutkan prioritas.
4. **Roadmap**: gelombang rilis (lihat `docs/brainstorming/kategori.md`).
5. **Definition of Done (DoD)**: syarat sebuah item dianggap selesai.
6. **Definition of Ready (DoR)**: syarat sebuah item boleh masuk sprint.
7. **Arsitektur awal**: multi-tenant, model data core, hierarki role/level (lihat `docs/brainstorming/role.md`), strategi offline-sync, integrasi pembayaran.
8. **Wireframe / prototipe** alur utama (transaksi, buka shift, tagihan).
9. **Rencana lingkungan & CI/CD**: dev, staging, production; pipeline otomatis.

### Per Sprint
10. **Sprint Backlog**: item terpilih untuk sprint ini.
11. **Sprint Goal**: satu kalimat tujuan sprint.
12. **Task breakdown**: pecahan teknis per user story.
13. **Increment**: hasil yang bisa didemokan di akhir sprint.
14. **Burndown/velocity chart**: pemantauan progres.

### Per Rilis
15. **Release plan & release notes**
16. **Test report / UAT sign-off**
17. **Dokumentasi pengguna** (help center, panduan onboarding)

## 3. Struktur Backlog

Hierarki: **Epic, lalu Feature, lalu User Story, lalu Task**.

Contoh Epic awal untuk platform ini:

| Epic | Isi ringkas |
|---|---|
| E1. Akun, Tenant & Outlet | Registrasi, onboarding, pilih kategori, multi-outlet |
| E2. Role & Permission | Role bawaan, role kustom, hierarki level, audit log |
| E3. Katalog | Item/produk/jasa, varian, kategori, harga |
| E4. Transaksi & Pembayaran | Keranjang, diskon, pajak, QRIS, tunai, split bill, struk |
| E5. Shift & Laporan | Buka/tutup shift, laporan penjualan, laba rugi dasar |
| E6. Pelanggan & Loyalitas | CRM, member, poin |
| E7. Stok & Inventori | Stok, opname, supplier |
| E8. Modul Vertikal FnB | Meja, KDS, modifier |
| E9. Modul Vertikal Kost | Kamar, penghuni, tagihan berulang, pengingat |
| E10. Back Office Platform | Panel internal, billing langganan, support tools |
| E11. Offline & Sinkronisasi | Transaksi offline, resolusi konflik |
| E12. Non-fungsional | Keamanan, performa, backup, observabilitas |

Format User Story:

```
Sebagai <role>,
saya ingin <tujuan>,
agar <manfaat>.

Kriteria Penerimaan (Given/When/Then):
- Given ..., When ..., Then ...
```

Contoh:
```
Sebagai Owner, saya ingin membuat role kustom dengan permission terpilih,
agar staf hanya mengakses fitur yang sesuai tugasnya.
- Given owner di halaman role, When memilih permission yang tidak ia miliki, Then opsi tidak tersedia.
- Given role kustom dengan level L4, When dua user L4 saling melihat, Then akses ditolak.
```

## 4. Ritual / Event Scrum

| Event | Kapan | Durasi (sprint 2 minggu) | Hasil |
|---|---|---|---|
| Backlog Refinement | Berkala, tengah sprint | 1-2 jam | Story siap (memenuhi DoR), ada estimasi |
| Sprint Planning | Awal sprint | 2-3 jam | Sprint goal dan sprint backlog |
| Daily Stand-up | Setiap hari | 15 menit | Sinkronisasi, hambatan terlihat |
| Sprint Review | Akhir sprint | 1-2 jam | Demo increment, umpan balik stakeholder |
| Sprint Retrospective | Setelah review | 1 jam | Aksi perbaikan proses |

Rekomendasi: sprint 2 minggu, estimasi dengan story point (Fibonacci), lacak velocity setelah 3 sprint.

## 5. Contoh DoD dan DoR

**Definition of Ready**
- Story punya kriteria penerimaan yang jelas
- Desain/wireframe tersedia (jika ada UI)
- Dependensi teknis diketahui
- Sudah diestimasi dan muat dalam satu sprint

**Definition of Done**
- Kode lolos code review
- Unit/integration test lulus, cakupan sesuai standar tim
- Lolos QA di staging, kriteria penerimaan terpenuhi
- Tidak ada bug kritis terbuka
- Dokumentasi/API spec diperbarui
- Aman dari kerentanan umum (cek otorisasi role/level)
- Siap deploy (feature flag bila perlu)

## 6. Rencana Sprint Awal (Usulan)

| Sprint | Fokus |
|---|---|
| Sprint 0 | Setup repo, CI/CD, arsitektur, desain sistem, wireframe, backlog awal |
| Sprint 1 | E1 Akun/tenant/outlet dan E2 Role dasar (role bawaan, level) |
| Sprint 2 | E3 Katalog dan E4 Transaksi dasar (tunai) |
| Sprint 3 | E4 pembayaran digital, struk, E5 shift dan laporan dasar |
| Sprint 4 | Modul vertikal pertama (FnB atau Kost) dan role kustom |
| Sprint 5 | E11 offline, E10 back office minimal, hardening |
| Sprint 6 | UAT dengan pelanggan pilot, perbaikan, rilis beta |

Rilis pertama (MVP) sebaiknya satu vertikal terlebih dahulu, lalu lanjut ke vertikal berikutnya agar umpan balik cepat.

## 7. Tooling

| Kebutuhan | Opsi |
|---|---|
| Backlog & sprint board | Jira, Linear, Trello, GitHub Projects |
| Dokumentasi | Confluence, Notion, Markdown di repo |
| Desain | Figma |
| Versi kode & CI/CD | GitHub/GitLab, pipeline otomatis |
| Komunikasi | Slack, WhatsApp grup tim |
| Monitoring | Sentry, log terpusat, dashboard uptime |

## 8. Metrik yang Dipantau

- Velocity per sprint
- Sprint goal tercapai (ya/tidak)
- Lead time dan cycle time
- Jumlah bug lolos ke produksi
- Metrik produk: tenant aktif, transaksi per hari, retensi, waktu onboarding

## 9. Risiko Khas Proyek Ini dan Mitigasi

| Risiko | Mitigasi |
|---|---|
| Scope melebar karena banyak vertikal | Fokus satu vertikal per rilis, core generik dulu |
| Sinkronisasi offline rumit | Bangun spike teknis di Sprint 0 |
| Hak akses bocor lintas role | Uji otorisasi otomatis untuk aturan level |
| Integrasi pembayaran tertunda | Mulai dengan tunai, lalu tambah gateway bertahap |
| Umpan balik pengguna terlambat | Pilot dengan 3-5 usaha nyata sejak Sprint 3 |

## 10. Pertanyaan Terbuka

1. Berapa besar tim dan apakah full-time?
2. Scrum penuh atau Kanban (lebih cocok jika tim kecil dan prioritas sering berubah)?
3. Vertikal mana yang jadi MVP pertama?
4. Apakah ada target tanggal rilis atau pelanggan pilot yang sudah pasti?
5. Tooling apa yang sudah dipakai tim (mis. Jira, Confluence)?
