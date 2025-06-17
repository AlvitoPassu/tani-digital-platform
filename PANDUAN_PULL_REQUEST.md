# Panduan Lengkap Membuat Pull Request di GitHub

## Apa itu Pull Request?

Pull Request (PR) adalah cara untuk mengusulkan perubahan pada repository GitHub. Ini memungkinkan Anda untuk:
- Mengusulkan perubahan kode
- Melakukan code review
- Berdiskusi tentang perubahan sebelum digabungkan
- Melacak riwayat perubahan

## Langkah-langkah Membuat Pull Request

### 1. Fork Repository (Jika Bukan Collaborator)

Jika Anda bukan collaborator di repository target:

1. Kunjungi repository di GitHub
2. Klik tombol **"Fork"** di pojok kanan atas
3. Pilih akun GitHub Anda sebagai tujuan fork
4. Repository akan di-copy ke akun Anda

### 2. Clone Repository ke Local

```bash
# Jika Anda fork repository
git clone https://github.com/username-anda/nama-repository.git

# Jika Anda collaborator
git clone https://github.com/pemilik-asli/nama-repository.git
```

### 3. Buat Branch Baru

```bash
# Pindah ke branch baru
git checkout -b nama-branch-anda

# Contoh nama branch yang baik:
git checkout -b feature/tambah-fitur-login
git checkout -b fix/perbaiki-bug-validasi
git checkout -b docs/tambah-dokumentasi
```

### 4. Lakukan Perubahan

1. Edit file yang diperlukan
2. Tambahkan file baru jika dibutuhkan
3. Hapus file yang tidak diperlukan

### 5. Commit Perubahan

```bash
# Lihat status perubahan
git status

# Tambahkan file yang diubah
git add .

# Atau tambahkan file tertentu
git add nama-file.txt

# Commit dengan pesan yang jelas
git commit -m "feat: tambahkan fitur login dengan OAuth"

# Contoh pesan commit yang baik:
# feat: tambahkan fitur baru
# fix: perbaiki bug
# docs: update dokumentasi
# style: perbaiki format kode
# refactor: refactor kode
# test: tambahkan unit test
```

### 6. Push ke Repository

```bash
# Push branch baru ke remote
git push origin nama-branch-anda

# Jika menggunakan fork
git push origin nama-branch-anda
```

### 7. Buat Pull Request di GitHub

1. **Buka GitHub** dan kunjungi repository target
2. **Klik tombol "Compare & pull request"** yang muncul setelah push
3. **Atau klik tab "Pull requests"** lalu klik **"New pull request"**

### 8. Isi Form Pull Request

#### Title (Judul)
- Buat judul yang jelas dan deskriptif
- Contoh: "Tambah fitur login dengan OAuth Google"

#### Description (Deskripsi)
```markdown
## Deskripsi
Menambahkan fitur login menggunakan OAuth Google untuk meningkatkan keamanan dan kemudahan akses pengguna.

## Perubahan yang Dilakukan
- [x] Tambah konfigurasi OAuth Google
- [x] Buat halaman login dengan OAuth
- [x] Tambah validasi token
- [x] Update dokumentasi API

## Testing
- [x] Test login dengan Google berhasil
- [x] Test validasi token berfungsi
- [x] Test error handling

## Screenshot (jika ada)
![Login Page](url-screenshot)

## Checklist
- [x] Kode sudah di-test
- [x] Dokumentasi sudah diupdate
- [x] Tidak ada breaking changes
- [x] Mengikuti coding standards
```

### 9. Review dan Submit

1. **Review perubahan** di tab "Files changed"
2. **Pastikan semua checklist terpenuhi**
3. **Klik "Create pull request"**

## Best Practices

### 1. Nama Branch yang Baik
```
feature/nama-fitur
fix/nama-bug
docs/nama-dokumen
style/perbaikan-format
refactor/nama-refactor
test/nama-test
```

### 2. Pesan Commit yang Baik
```
feat: tambahkan fitur login OAuth
fix: perbaiki validasi email
docs: update README.md
style: format kode sesuai standar
refactor: pisahkan logic authentication
test: tambah unit test untuk login
```

### 3. Deskripsi PR yang Lengkap
- Jelaskan apa yang diubah
- Mengapa perubahan diperlukan
- Bagaimana cara testing
- Screenshot jika ada perubahan UI

### 4. Ukuran PR yang Wajar
- Jangan buat PR terlalu besar (>500 baris)
- Fokus pada satu fitur/bug per PR
- Jika terlalu besar, pecah menjadi beberapa PR

## Workflow Lengkap

```bash
# 1. Update branch utama
git checkout main
git pull origin main

# 2. Buat branch baru
git checkout -b feature/nama-fitur

# 3. Lakukan perubahan
# ... edit file ...

# 4. Commit perubahan
git add .
git commit -m "feat: tambahkan fitur baru"

# 5. Push ke remote
git push origin feature/nama-fitur

# 6. Buat PR di GitHub
# 7. Tunggu review dan approval
# 8. Merge jika sudah disetujui
```

## Setelah PR Di-merge

```bash
# Hapus branch lokal
git checkout main
git pull origin main
git branch -d feature/nama-fitur

# Hapus branch remote (opsional)
git push origin --delete feature/nama-fitur
```

## Tips Tambahan

1. **Selalu update branch utama** sebelum membuat branch baru
2. **Gunakan conventional commits** untuk pesan commit
3. **Buat PR draft** jika belum selesai dengan mencentang "Draft pull request"
4. **Request reviewer** yang tepat
5. **Respon feedback** dengan cepat
6. **Gunakan labels** untuk mengkategorikan PR

## Troubleshooting

### Jika ada conflict
```bash
# Update branch dengan main
git checkout main
git pull origin main
git checkout nama-branch-anda
git merge main

# Resolve conflict manual
# Lalu commit
git add .
git commit -m "resolve merge conflicts"
git push origin nama-branch-anda
```

### Jika perlu update PR
```bash
# Lakukan perubahan
git add .
git commit -m "update: perbaikan berdasarkan feedback"
git push origin nama-branch-anda
```

PR akan otomatis ter-update di GitHub! 