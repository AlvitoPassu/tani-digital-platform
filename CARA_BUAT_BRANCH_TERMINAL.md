# Cara Membuat Branch Baru untuk Pull Request melalui Terminal

## Prerequisites (Persiapan)

Sebelum membuat branch baru, pastikan Anda sudah:
1. **Git terinstall** di komputer
2. **Repository sudah di-clone** ke local
3. **Sudah login ke GitHub** (untuk push nanti)

## Langkah-langkah Membuat Branch Baru

### 1. Pastikan Anda di Directory Repository

```bash
# Pindah ke directory repository
cd path/ke/repository-anda

# Contoh:
cd /c/Users/Asus/OneDrive/Dokumen/sofeng/tani-digital-platform-main

# Cek apakah sudah di repository yang benar
git status
```

### 2. Update Branch Utama (Main/Master)

```bash
# Pindah ke branch utama
git checkout main
# atau
git checkout master

# Update dengan perubahan terbaru dari remote
git pull origin main
# atau
git pull origin master
```

### 3. Buat Branch Baru

```bash
# Buat dan pindah ke branch baru sekaligus
git checkout -b nama-branch-anda

# Contoh nama branch yang baik:
git checkout -b feature/tambah-fitur-login
git checkout -b fix/perbaiki-bug-validasi
git checkout -b docs/tambah-dokumentasi
git checkout -b style/perbaiki-format-kode
git checkout -b refactor/pisahkan-logic-auth
git checkout -b test/tambah-unit-test
```

### 4. Verifikasi Branch Baru

```bash
# Cek branch yang sedang aktif
git branch

# Output akan menampilkan semua branch dengan * di branch aktif
# * feature/tambah-fitur-login
#   main

# Cek status repository
git status
```

## Contoh Workflow Lengkap

### Skenario 1: Menambah Fitur Baru

```bash
# 1. Update main branch
git checkout main
git pull origin main

# 2. Buat branch untuk fitur baru
git checkout -b feature/tambah-fitur-login

# 3. Lakukan perubahan
# ... edit file-file yang diperlukan ...

# 4. Cek status perubahan
git status

# 5. Tambahkan file yang diubah
git add .

# 6. Commit perubahan
git commit -m "feat: tambahkan fitur login dengan OAuth"

# 7. Push branch baru ke remote
git push origin feature/tambah-fitur-login

# 8. Buat Pull Request di GitHub
# Buka GitHub dan klik "Compare & pull request"
```

### Skenario 2: Memperbaiki Bug

```bash
# 1. Update main branch
git checkout main
git pull origin main

# 2. Buat branch untuk bug fix
git checkout -b fix/perbaiki-validasi-email

# 3. Lakukan perbaikan
# ... edit file yang bermasalah ...

# 4. Test perbaikan
# ... jalankan test ...

# 5. Commit perbaikan
git add .
git commit -m "fix: perbaiki validasi email yang tidak berfungsi"

# 6. Push ke remote
git push origin fix/perbaiki-validasi-email
```

### Skenario 3: Update Dokumentasi

```bash
# 1. Update main branch
git checkout main
git pull origin main

# 2. Buat branch untuk dokumentasi
git checkout -b docs/update-readme

# 3. Update dokumentasi
# ... edit README.md atau file dokumentasi lain ...

# 4. Commit perubahan
git add .
git commit -m "docs: update README dengan instruksi instalasi"

# 5. Push ke remote
git push origin docs/update-readme
```

## Konvensi Penamaan Branch

### Format Umum
```
<tipe>/<deskripsi-singkat>
```

### Tipe Branch yang Umum
- `feature/` - untuk fitur baru
- `fix/` - untuk perbaikan bug
- `docs/` - untuk dokumentasi
- `style/` - untuk perbaikan format/style
- `refactor/` - untuk refactoring kode
- `test/` - untuk menambah test
- `chore/` - untuk tugas maintenance

### Contoh Nama Branch yang Baik
```bash
git checkout -b feature/user-authentication
git checkout -b fix/login-validation-error
git checkout -b docs/api-documentation
git checkout -b style/format-code-standards
git checkout -b refactor/extract-auth-service
git checkout -b test/add-login-unit-tests
git checkout -b chore/update-dependencies
```

### Contoh Nama Branch yang Buruk
```bash
# ❌ Jangan gunakan nama seperti ini:
git checkout -b new-feature
git checkout -b fix
git checkout -b update
git checkout -b branch1
git checkout -b test123
```

## Command Git yang Berguna

### Melihat Branch
```bash
# Lihat semua branch lokal
git branch

# Lihat semua branch (lokal + remote)
git branch -a

# Lihat branch remote saja
git branch -r
```

### Menghapus Branch
```bash
# Hapus branch lokal (setelah di-merge)
git branch -d nama-branch

# Hapus branch lokal (force delete)
git branch -D nama-branch

# Hapus branch remote
git push origin --delete nama-branch
```

### Pindah Antar Branch
```bash
# Pindah ke branch lain
git checkout nama-branch

# Pindah ke branch lain (Git 2.23+)
git switch nama-branch

# Buat dan pindah ke branch baru (Git 2.23+)
git switch -c nama-branch-baru
```

## Troubleshooting

### Jika Branch Sudah Ada
```bash
# Cek apakah branch sudah ada
git branch -a | grep nama-branch

# Jika sudah ada, pindah ke branch tersebut
git checkout nama-branch

# Atau buat nama branch yang berbeda
git checkout -b nama-branch-v2
```

### Jika Lupa Nama Branch
```bash
# Lihat semua branch
git branch -a

# Cari branch berdasarkan keyword
git branch -a | grep keyword
```

### Jika Ada Error Saat Push
```bash
# Jika branch belum ada di remote
git push -u origin nama-branch

# Atau set upstream
git push --set-upstream origin nama-branch
```

## Tips dan Best Practices

1. **Selalu update main branch** sebelum membuat branch baru
2. **Gunakan nama branch yang deskriptif** dan mudah dipahami
3. **Satu fitur/bug per branch** - jangan gabung beberapa fitur dalam satu branch
4. **Commit secara teratur** dengan pesan yang jelas
5. **Test kode** sebelum push
6. **Hapus branch** setelah di-merge untuk menjaga repository tetap bersih

## Workflow Singkat

```bash
# Workflow lengkap dalam satu blok
git checkout main
git pull origin main
git checkout -b feature/nama-fitur
# ... lakukan perubahan ...
git add .
git commit -m "feat: tambahkan fitur baru"
git push origin feature/nama-fitur
```

Sekarang Anda siap membuat Pull Request di GitHub! 