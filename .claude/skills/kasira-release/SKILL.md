---
name: kasira-release
description: Alur git repo mockup Kasira (github.com/dumns/kasira) - branch, commit, push, merge, staging, release, dan deploy Vercel. Pakai saat commit, push, merge, memindahkan kode ke staging, atau diminta merilis mockup. Semua tindakan git hanya atas perintah eksplisit.
---

# Git, staging, dan rilis Kasira

Repo: https://github.com/dumns/kasira (mockup HTML, memakai design system Ordinara dari npm). Mockup **tidak punya semver, tag, atau npm**; versinya tanggal (`templates/CHANGELOG.md`).

## Aturan mutlak
- **Commit, push, merge, dan rilis hanya atas perintah.** "Commit & push" bukan merge. Persetujuan sebelumnya tidak berlaku untuk tindakan berikutnya.
- "Siapkan" atau "kerjakan" = ubah file saja. Berhenti sebelum commit dan katakan belum ada yang di-commit.
- Pesan commit **satu baris**, tanpa deskripsi, tanpa co-author dan tanpa "Generated with".
- **Stage per path**, jangan `git add -A`. `reference/`, `node_modules/`, `dist/`, `assets/js/vendor/` tidak pernah di-commit (sudah di `.gitignore`).
- **Jangan commit di `master`**, `release`, atau `staging`. Ketiganya hanya menerima merge.
- Merge selalu `--no-ff`. Pull dulu sebelum merge atau push; bila perubahan lokal menghalangi, stash, jangan timpa.
- Jangan `--force` kecuali diminta eksplisit.
- **Setiap perubahan mockup wajib masuk `templates/CHANGELOG.md`** (tanggal hari itu, "Dasar Ordinara: vX.Y.Z") dalam commit yang sama.
- Cek identitas sebelum commit pertama di mesin ini: `git config user.name` dan `user.email` harus akun GitHub pribadi untuk repo `dumns`, bukan akun kantor.

## Branch

| Branch | Fungsi |
|---|---|
| `master` | Hasil merge yang sudah dirilis. Tidak ada commit langsung. |
| `mockup/<YYYY-MM-DD>` | Cabang kerja satu hari/satu batch, dibuat dari `release`. Bila perlu lebih dari satu di hari yang sama: `mockup/<tanggal>-<topik>`. |
| `staging` | Integrasi untuk pratinjau, menampung pekerjaan yang belum rilis. |
| `release` | Branch permanen produksi. Hanya menerima merge dari `master`. |
| `kasira/staging-vercel` | Cabang deploy staging (Vercel). Hanya menerima merge dari `staging`. |
| `kasira/vercel` | Cabang deploy produksi (Vercel). Hanya menerima merge dari `release`. |

Tanpa prefiks `feat/`, `fix/`, `chore/`. Nama cabang deploy di atas adalah usulan awal; sesuaikan bila project Vercel memakai nama lain.

## Commit

Format: `<tipe>(<scope>): <ringkasan singkat>` huruf kecil, tanpa titik, bahasa Indonesia atau Inggris mengikuti riwayat `git log` (cek dulu dan tiru).

| Tipe | Pakai untuk |
|---|---|
| `feat(owner)` | Halaman atau bagian baru (scope = folder role: `owner`, `manager`, `kasir`, ...) |
| `fix(owner)` | Perbaikan tampilan atau perilaku |
| `style(...)` | Perapian visual tanpa mengubah fungsi |
| `docs` | `docs/`, `README.md`, `AGENTS.md`, `templates/CHANGELOG.md` yang berdiri sendiri |
| `chore` | Build, dependensi (termasuk naik versi Ordinara), skrip, skill |

- Gabungkan commit satu topik; jangan banyak commit kecil untuk satu halaman.
- Naik versi Ordinara = satu commit `chore: ordinara vX.Y.Z` (`package.json`, `package-lock.json`) dan, bila tampilan terdampak, perbaikan halaman di commit terpisah beserta entri changelog.
- Contoh: `feat(owner): dashboard dan tim & peran`, `fix(owner): margin konten dan profil di navbar`.

Urutan commit:
1. `git status` dan `git diff --stat`: pastikan hanya file milik pekerjaan ini. File berubah yang bukan milik sesi ini jangan di-stage.
2. Pastikan `templates/CHANGELOG.md` sudah memuat perubahan.
3. `git add <path> ...` lalu `git commit -m "<satu baris>"`.

## Alur

```
mockup/<tanggal>  >  staging  >  kasira/staging-vercel          (pratinjau)
mockup/<tanggal>  >  master   >  release  >  kasira/vercel      (rilis)
```

### Push cabang kerja
`git push -u origin mockup/<tanggal>`. Remote lewat SSH (`git@github.com:dumns/kasira.git`). Tidak ada tag, GitHub release, atau publish npm untuk mockup.

### Staging (hanya atas perintah "ke staging")
1. Pull `staging`, `git merge --no-ff mockup/<tanggal>`, push `staging`.
2. Pull `kasira/staging-vercel`, `git merge --no-ff staging`, push. Merge commit inilah yang memicu build Vercel staging.
3. Kerjakan merge ke cabang deploy di **worktree sementara** (`git worktree add`) agar working tree berisi pekerjaan lain tidak terganggu; hapus worktree setelahnya.

### Rilis (hanya atas perintah eksplisit "rilis")
Periksa dulu **gerbang produksi**: versi di baris "Dasar Ordinara" pada `templates/CHANGELOG.md` harus versi yang sudah dirilis (bertag dan terbit di npm). Bila belum, mockup tertahan di staging dan katakan alasannya.

1. `mockup/<tanggal>` > `master`: pull, `git merge --no-ff`, push.
2. `master` > `release`: pull, `git merge --no-ff master`, push.
3. `release` > `kasira/vercel`: pull, `git merge --no-ff release`, push (worktree sementara). Merge commit memicu build Vercel produksi.
4. Cek hasil deploy (`gh api repos/dumns/kasira/deployments` atau dashboard Vercel) dan laporkan URL-nya.

Singkatan "merge ke master" = langkah 1 saja. "Rilis" = langkah 1 sampai 3. Jangan melangkah lebih jauh dari yang diperintahkan.

### Setelah merge atau konflik
- Konflik diselesaikan di cabang kerja, tanpa menghilangkan kode dari cabang lain.
- Pastikan tidak ada kode yang hilang dan release tidak rusak: bandingkan `git diff <sebelum>..<sesudah> --stat`, jalankan `npm run build`, dan buka halaman utama lewat `npm run serve`. Laporkan hasilnya jujur.
- Bila ada perubahan lokal yang menghalangi pull, `git stash` per topik, jangan menimpa.

## Vercel
- Build Command: `npm run build`; Output Directory: `.` (akar repo, statis); Install Command: `npm install`. Atur di dashboard, bukan `vercel.json`.
- `dist/` dan `assets/js/vendor/` dibuat saat build, jadi tidak di-commit. Jangan merge ke cabang deploy sebelum Build Command terisi.
- Hanya cabang deploy yang memicu Vercel; cabang kerja, `staging`, `master`, dan `release` tidak.
- Ordinara dipasang dari npm (publik), jadi tidak perlu token tambahan untuk install.

## Sebelum melapor selesai
- Untuk perubahan tampilan: ikuti checklist di `AGENTS.md` (browser 320, 390, 768, desktop; tanpa overflow, galat konsol, atau 404).
- Sebutkan jelas apa yang sudah dilakukan dan apa yang belum (mis. "sudah push cabang kerja, belum merge ke staging").
- Jika ada kredensial atau token terlihat di chat, jangan diulang dan ingatkan untuk rotasi.
