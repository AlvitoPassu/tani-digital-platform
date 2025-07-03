# 🌾 Arsitektur Sistem - Tani Digital Platform

## 🧭 Tujuan
Dokumen ini menjelaskan desain arsitektur dari proyek **Tani Digital Platform**, sebuah sistem digital yang membantu petani dan pelaku agribisnis melalui marketplace alat-alat perkebunan, AI pendukung keputusan, chatbot, serta integrasi IoT untuk pemantauan hasil panen.

---

## 🧱 1. Arsitektur Umum (3-Tier Architecture + AI & IoT)
Sistem menggunakan pendekatan 3-tier architecture yang diperluas dengan komponen AI dan IoT:


---

## 🎯 2. Komponen Utama

### 🔹 A. Frontend (Presentation Layer)
- **Framework**: React / Next.js
- **Fungsi**:
  - Marketplace alat perkebunan
  - Dashboard pintar (menampilkan hasil panen, profit, grafik)
  - Interaksi dengan AI chatbot dan vision tool
  - Pendaftaran dan login user
- **Komunikasi**: REST API / Supabase Client SDK

---

### 🔹 B. Backend (Application Logic Layer)
- **Platform**: Supabase atau Node.js + Express (jika kustom)
- **Fungsi**:
  - Autentikasi & manajemen user
  - API produk, keranjang, transaksi
  - Integrasi AI Crop Planner
  - Endpoint untuk menerima data IoT timbangan digital
- **Middleware**:
  - Validasi input
  - Token JWT
  - Logger & Error Handler

---

### 🔹 C. Database (Data Layer)
- **Tipe**: PostgreSQL (via Supabase)
- **Data yang disimpan**:
  - Data produk alat perkebunan
  - Informasi user & transaksi
  - Riwayat timbang hasil panen
  - Log rekomendasi AI

---

### 🔸 D. AI Services
- **1. Vision AI**:
  - Input: Foto tanaman
  - Output: Deteksi penyakit / jenis tanaman
  - Tools: HuggingFace / TensorFlowJS / Python Flask API

- **2. AI Crop Planner**:
  - Input: Data cuaca, pasar, histori panen
  - Output: Rekomendasi komoditas yang menguntungkan
  - Tools: Model Machine Learning (Scikit-Learn, Pandas, Prophet)

- **3. AI Chatbot**:
  - Natural language assistant untuk petani
  - Berbasis LLM (OpenAI API atau model lokal)

---

### 🔸 E. IoT Layer
- **Perangkat**: Timbangan digital (baterai, portabel)
- **Komunikasi**: MQTT / REST API
- **Fungsi**:
  - Kirim data hasil panen ke backend
  - Update data di dashboard secara real-time

---

## 🧩 3. Integrasi Antar Komponen

| Komponen | Terhubung ke | Protokol/Metode |
|----------|--------------|------------------|
| Frontend | Backend API  | REST / Supabase SDK |
| Backend  | DB           | SQL via Supabase |
| Backend  | AI Services  | HTTP API / Python Flask |
| Backend  | IoT Devices  | MQTT / REST endpoint |

---

## 📊 4. Contoh Use Case: Petani Timbang Hasil Panen
1. Petani login ke dashboard
2. Timbangan digital mengirim data hasil panen ke backend
3. Backend menyimpan data ke database
4. Dashboard frontend menarik data hasil timbang
5. AI Crop Planner menganalisis tren panen dan memberi rekomendasi

---

## 📅 5. Teknologi yang Digunakan

| Komponen     | Teknologi                          |
|--------------|------------------------------------|
| Frontend     | React.js / Next.js                 |
| Backend      | Supabase / Node.js + Express       |
| Database     | PostgreSQL                         |
| AI Services  | HuggingFace, Scikit-Learn, Flask   |
| IoT          | Timbangan + REST API / MQTT        |
| Hosting      | Vercel (frontend), Railway/VPS     |
| Storage      | Supabase Storage / Cloudinary      |

---

## 🛡️ 6. Keamanan & Skalabilitas
- Autentikasi JWT via Supabase
- Role-based access control
- Validasi input di backend
- Data terenkripsi di database
- AI dan IoT dipisahkan untuk skalabilitas

---

## 📌 7. Catatan Tambahan
- File ini dapat diperbarui jika struktur proyek berubah
- Gunakan `docs/` folder untuk dokumentasi lanjutan (misal: ERD, DFD, Sequence)

---

