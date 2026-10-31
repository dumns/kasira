# Brainstorming Role Platform POS Multi-Vertikal

Role dibagi dua sisi: **internal** (tim pembuat platform) dan **eksternal** (pengguna platform dan pihak yang berinteraksi dengannya).

## 0. Keputusan yang Sudah Ditetapkan

| No | Keputusan | Implikasi desain |
|---|---|---|
| 1 | **Owner boleh membuat role kustom.** | Perlu permission granular dan editor role di sisi tenant. Role bawaan tetap disediakan sebagai template. |
| 2 | **Role yang setara (selevel) tidak bisa mengakses satu sama lain. Hanya tingkat di atasnya yang bisa.** | Setiap role punya **level** dalam hierarki. Akses lintas role (lihat, kelola, reset, nonaktifkan, lihat aktivitas) hanya dari level lebih tinggi ke level lebih rendah. |

Aturan turunan (usulan, perlu dikonfirmasi):
- Berlaku untuk akses ke **user dan data milik role lain** (profil, aktivitas, transaksi yang diinput, pengaturan akun), bukan sekadar akses menu.
- Kasir A tidak bisa melihat atau mengelola Kasir B. Manager bisa mengelola Kasir dan Supervisor di outletnya, tetapi tidak bisa mengelola Manager lain.
- Role kustom **wajib ditempatkan pada satu level** saat dibuat. Level menentukan siapa yang bisa mengelolanya dan siapa yang setara dengannya.
- Owner hanya bisa memberi permission yang **ia sendiri miliki**, dan tidak bisa membuat role yang levelnya setara atau di atas dirinya (mencegah eskalasi hak akses).
- User hanya bisa membuat atau mengubah role dengan level **di bawahnya**.
- Role di atas bersifat **cascade ke bawah dalam cakupannya** (tenant, outlet). Manager Outlet A tidak otomatis melihat Outlet B.
- Berlaku juga di sisi internal: Support L1 dan L1 lain saling terpisah, hanya Lead/Super Admin di atasnya yang bisa melihat.
- Pengecualian yang mungkin: data yang memang dibagikan secara eksplisit (mis. laporan shift untuk serah-terima), bukan akses ke akun/aktivitas.

Contoh level (sisi tenant):

```
L1  Owner / Co-owner        (cakupan: seluruh tenant)
L2  Manager Outlet           (cakupan: outlet yang ditugaskan)
L3  Supervisor / Shift Leader
L4  Kasir, Gudang, Waiter, Stylist, Mekanik, ...   (sesama L4 saling terpisah)
```

Role kustom buatan owner dipetakan ke salah satu level (L2 sampai L4), misalnya "Kepala Dapur" di L3 atau "Kasir Magang" di L4.

## 1. Role Internal (Tim Pembuat Platform)

Mengakses **back office platform** (panel admin pusat), bukan aplikasi kasir milik tenant.

| Role | Tanggung jawab | Akses utama |
|---|---|---|
| Super Admin | Pemilik akses penuh sistem, kelola role internal, konfigurasi global | Semua |
| Product / Operations Admin | Kelola kategori usaha, template per vertikal, paket langganan, fitur flag | Master kategori, paket, fitur |
| Customer Support (L1) | Bantu pengguna: reset password, cek status akun, jawab pertanyaan | Lihat data tenant (terbatas), tiket |
| Technical Support (L2) | Investigasi bug, sinkronisasi gagal, masalah printer/integrasi | Log, data tenant (read), impersonate dengan izin |
| Customer Success / Onboarding | Pendampingan onboarding, migrasi data, training | Lihat tenant, bantu setup |
| Sales / Business Development | Kelola calon pelanggan, demo, trial, kemitraan | CRM, pembuatan tenant trial |
| Finance / Billing Admin | Tagihan langganan, invoice, refund, rekonsiliasi payment gateway, komisi | Billing, laporan keuangan platform |
| Compliance / Risk | Verifikasi usaha (KYB), pantau fraud, penanganan sengketa | Data verifikasi, flag akun |
| Developer / Engineer | Pengembangan dan operasional sistem | Environment, log, database (dengan kontrol) |
| Data / Analyst | Analitik penggunaan platform, churn, performa per kategori | Data agregat/anonim |
| Content / Marketing Admin | Konten help center, banner, pengumuman, promo | CMS, notifikasi massal |
| Auditor (read-only) | Audit internal/eksternal | Read-only log dan laporan |

Catatan:
- Impersonate (masuk sebagai tenant) wajib tercatat di audit log dan sebaiknya butuh persetujuan atau alasan.
- Data tenant yang sensitif (omzet, pelanggan) disembunyikan dari role yang tidak perlu.

## 2. Role Eksternal

### 2.1 Sisi Tenant (Pemilik Usaha dan Stafnya)

Hierarki: **Akun Tenant, lalu Outlet/Cabang, lalu User**.

| Role | Tanggung jawab | Contoh pada kategori |
|---|---|---|
| Owner | Pemilik akun, kelola langganan, semua outlet, laporan lengkap, kelola user | Pemilik kafe, pemilik kost |
| Co-owner / Partner | Hak mirip owner, tanpa akses billing/hapus akun | Investor, pasangan pemilik |
| Manager (Manajer Outlet) | Operasional satu atau beberapa outlet: harga, stok, void/refund, laporan outlet | Manajer cabang |
| Supervisor / Shift Leader | Persetujuan void/diskon, tutup shift | Kepala shift |
| Kasir | Transaksi, pembayaran, cetak struk, buka/tutup shift | Kasir toko |
| Staf Gudang / Inventori | Stok masuk/keluar, stok opname, supplier | Retail, FnB |
| Akuntan / Finance | Laporan keuangan, pengeluaran, pajak (umumnya read-only transaksi) | Pembukuan usaha |

Role operasional khusus per vertikal (aktif sesuai kategori):

| Vertikal | Role tambahan |
|---|---|
| FnB | Waiter / pelayan, Staf Dapur (KDS), Bartender, Runner |
| Kost / properti | Pengelola kost / penjaga, Staf teknis (maintenance), Penagih |
| Salon / spa / klinik | Stylist / terapis / dokter (punya jadwal dan komisi), Resepsionis |
| Laundry / bengkel | Operator produksi (cuci, setrika), Mekanik, Kurir |
| Gym / bimbel | Instruktur / pengajar, Staf front desk |
| Wisata / event | Petugas gate (scan tiket) |
| Rental | Petugas serah-terima kendaraan/alat |
| Multi-tenant (food court) | Admin pengelola lokasi, Tenant/Stand |

Catatan desain:
- Sebaiknya pakai **permission granular** (mis. `refund.approve`, `price.edit`, `report.view`) yang dikelompokkan ke dalam role, bukan role hard-coded. Owner bisa membuat **role kustom**.
- Penugasan role bisa per outlet (satu orang jadi manajer di Outlet A, kasir di Outlet B).
- Kasir sebaiknya bisa login cepat via PIN di perangkat toko.

### 2.2 Sisi Pelanggan Akhir (Customer dari Tenant)

Tidak memakai panel kasir, tetapi berinteraksi lewat portal/QR/WhatsApp.

| Role | Interaksi | Contoh |
|---|---|---|
| Pelanggan / Guest | Pesan via QR meja, lihat struk digital, ikut promo | Pembeli kafe |
| Member / Anggota | Poin loyalitas, saldo, riwayat transaksi, keanggotaan | Member gym, salon |
| Penghuni / Penyewa | Lihat tagihan bulanan, bayar, ajukan komplain | Penghuni kost |
| Pasien / Klien | Booking jadwal, lihat riwayat layanan | Klinik, salon |
| Siswa / Wali | Lihat tagihan SPP, riwayat bayar | Bimbel, PAUD |
| Pemesan Online | Order dan lacak status | Laundry, katering |

### 2.3 Sisi Pihak Ketiga

| Role | Interaksi |
|---|---|
| Supplier / Vendor | Menerima purchase order, tagihan dari tenant (opsional portal) |
| Mitra Integrasi / Developer API | Memakai API/webhook (marketplace, akuntansi, payment gateway) |
| Reseller / Agen / Mitra Penjualan | Menjual platform, dapat komisi, mengelola tenant binaan |
| Akuntan Eksternal / Konsultan Pajak | Akses read-only laporan atas undangan owner |
| Kurir / Driver | Penerima tugas antar-jemput (laundry, FnB) |

## 3. Ringkasan Hierarki

```
Platform (internal)
 ├─ Super Admin, Ops, Support, Finance, Compliance, Dev, ...
 │
 └─ Tenant (eksternal)
     ├─ Owner / Co-owner
     │   └─ Outlet
     │       ├─ Manager, Supervisor
     │       ├─ Kasir, Gudang, Akuntan
     │       └─ Role vertikal (waiter, stylist, mekanik, ...)
     │
     └─ Pelanggan akhir (member, penghuni, pasien, ...)
```

## 4. Usulan Prioritas MVP

**Internal (cukup dulu):** Super Admin, Support, Finance/Billing, Developer.
**Eksternal tenant:** Owner, Manager, Kasir, lalu satu role vertikal sesuai kategori pertama.
**Pelanggan akhir:** Guest dan Member sederhana; portal penghuni untuk kost.
**Ditunda:** Reseller, Auditor, portal supplier, role kustom penuh.

## 5. Pertanyaan Terbuka

1. ~~Apakah owner boleh membuat role kustom?~~ **Sudah diputuskan: boleh** (lihat bagian 0). Sisa pertanyaan: berapa level yang disediakan, dan apakah ada batas jumlah role kustom per paket langganan?
2. Apakah perlu program reseller/agen sejak awal?
3. Siapa yang menangani verifikasi usaha (KYB) dan di tahap mana?
4. Apakah support boleh impersonate tenant, dan bagaimana kontrol persetujuannya?
5. Apakah pelanggan akhir perlu akun, atau cukup identitas nomor WhatsApp?
6. Satu orang boleh punya akun di beberapa tenant (mis. akuntan yang melayani banyak usaha)?
7. Apakah ada tingkat tenant induk (franchise/holding) di atas owner?
8. Apakah aturan "setara tidak saling akses" juga berlaku untuk laporan gabungan (mis. kasir ingin melihat transaksinya sendiri tetapi tidak transaksi kasir lain)? Usulan: ya, kasir hanya melihat miliknya sendiri.
9. Untuk role setara dengan fungsi serah-terima (kasir shift pagi dan malam), apakah perlu mekanisme berbagi data yang eksplisit, seperti laporan tutup shift?
