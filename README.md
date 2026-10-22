# SISTEM ARKIB PRODUK INOVASI ePEMBELAJARAN (SAPIe)
## POLITEKNIK BANTING SELANGOR

![Status](https://img.shields.io/badge/Status-Sedia_Pengeluaran-success?style=for-the-badge)
![Institusi](https://img.shields.io/badge/Institusi-Politeknik_Banting_Selangor-163A5F?style=for-the-badge)
![Bahasa](https://img.shields.io/badge/Antaramuka-Bahasa_Melayu-245B8F?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-React_18_|_TypeScript_|_Tailwind_|_Firebase-3977B9?style=for-the-badge)

---

## 1. Pengenalan & Latar Belakang

**SISTEM ARKIB PRODUK INOVASI ePEMBELAJARAN (SAPIe)** ialah aplikasi web pengurusan maklumat institusi yang komprehensif, selamat, dan responsif bagi **Politeknik Banting Selangor**. 

Sistem ini berfungsi sebagai repositori dan platform pengurusan berpusat bagi semua produk inovasi pengajaran dan pembelajaran (PdP) digital yang dihasilkan oleh pensyarah dan staf akademik merentasi semua jabatan (Jabatan Kejuruteraan Mekanikal - JKM, Jabatan Kejuruteraan Penyelenggaraan Pesawat - JPP, Jabatan Matematik, Sains & Komputer - JMSK, dan Jabatan Pengajian Am - JPA).

SAPIe bukan sekadar prototaip atau mockup statik, tetapi sistem maklumat institusi berfungsi sepenuhnya dengan pengesahan pengguna, kawalan capaian berasaskan peranan (RBAC), penjanaan kod arkib institusi atomik, pengesahan pencapaian, repositori dokumen dengan kawalan keselamatan, analitik dinamik, dan penjanaan laporan rasmi (PDF, XLSX, CSV).

---

## 2. Ciri-Ciri Utama Sistem

### A. Dashboard Utama Dinamik
- **8 Kad Metrik Utama:** Jumlah Produk Berdaftar, Produk Diluluskan, Pendaftaran Dalam Semakan, Produk Dalam Pembangunan, Jumlah Pencapaian Disahkan, Jumlah Dokumen Arkib, Bilangan Jabatan Terlibat, dan Bilangan Pencipta Produk.
- **Carta Taburan:** Visualisasi produk mengikut jabatan, pecahan status pendaftaran (Recharts), dan taburan pengiktirafan.
- **Tindakan Diperlukan (Actionable Items):** Pemberitahuan tindakan segera untuk pendaftaran menunggu kelulusan, produk perlu pembetulan, dan pencapaian menanti semakan.
- **Penapis Global:** Mengemaskini keseluruhan metrik dan carta mengikut Tahun dan Jabatan.

### B. Modul Pendaftaran Produk (Aliran 6 Bahagian)
- **Bahagian A:** Maklumat Asas Produk (Tajuk, Ringkasan, Penerangan, Objektif, Pernyataan Masalah, Thumbnail).
- **Bahagian B:** Maklumat Akademik (Jabatan, Program, Kod Kursus, Nama Kursus, Semester, Sasaran Pengguna, Kaedah PdP).
- **Bahagian C:** Kategori & Teknologi (Modul Pembelajaran Digital, Video Interaktif, Gamifikasi, AR, VR, Simulasi, Canva, H5P, CIDOS, Unity, dll.).
- **Bahagian D:** Maklumat Pencipta & Ahli Pasukan (Pencipta Utama dan sokongan dinamik pelbagai ahli pasukan projek).
- **Bahagian E:** Maklumat Pembangunan (Tahun pembangunan, status pembangunan, versi, pautan produk digital, dan pautan demo/repositori).
- **Bahagian F:** Ringkasan & Butang Tindakan (*Simpan Draf* dan *Hantar untuk Semakan*).
- **Pencegahan Rekod Bertindih:** Amaran automatik bagi tajuk produk yang serupa.
- **Penjana Kod Arkib Institusi:** Penjanaan format kod unik atomik: `PBS-EP-[TAHUN]-[SIRI_4_DIGIT]` (cth: `PBS-EP-2026-0001`).

### C. Arkib Produk & Profil Terperinci (7 Tab)
- Paparan fleksibel: Tukar antara **Paparan Kad (Grid)** dan **Paparan Jadual (Table)**.
- Carian pantas berbilang kriteria dan penapis jabatan, kategori, status, dan tahun.
- **Profil Terperinci 7 Tab:**
  1. *Ringkasan:* Sinopsis eksekutif, penerangan terperinci, maklumat pantas, dan pautan produk digital.
  2. *Maklumat Produk:* Konteks kurikulum dan kaedah pedagogi PdP.
  3. *Pencipta dan Pasukan:* Profil ketua inovasi dan ahli-ahli pembangun.
  4. *Pencapaian:* Senarai anugerah dan pingat dengan butang pendaftaran baharu.
  5. *Laporan:* Status penilaian amali dan impak pembelajaran.
  6. *Dokumen Sokongan:* Repositori fail sokongan dengan muat turun selamat.
  7. *Sejarah Perubahan:* Jejak audit kronologi status pendaftaran.
- **Aliran Kelulusan Pentadbir:** Butang tindakan untuk meluluskan produk, memulangkan untuk pembetulan, atau menolak permohonan.

### D. Pengurusan Pencapaian & Pengiktirafan
- Merekodkan pingat (Emas, Perak, Gangsa, Johan, Naib Johan, Anugerah Khas).
- Klasifikasi peringkat pengiktirafan (Institusi, Zon, Negeri, Kebangsaan, Antarabangsa).
- Aliran pengesahan pentadbir (*Disahkan*, *Memerlukan Pembetulan*, *Ditolak*).

### E. Pengurusan Dokumen & Keselamatan Fail
- Sokongan muat naik fail PDF, DOCX, XLSX, PPTX, dan imej.
- Sekatan keselamatan mutlak terhadap fail eksekusi merbahaya (`.exe`, `.bat`, `.cmd`, `.sh`, `.ps1`, `.dll`, dsb.).
- Klasifikasi akses fail: **Awam**, **Dalaman**, **Terhad**, dan **Sulit**.
- Penjejakan saiz fail dan rekod muat naik.

### F. Pusat Analitik & Penjanaan Laporan Institusi
- **Laporan A:** Laporan Keseluruhan Produk Inovasi
- **Laporan B:** Laporan Rekod Pencapaian & Pengiktirafan
- **Laporan C:** Laporan Penggunaan & Impak Pembelajaran
- **Laporan D:** Laporan Kelengkapan Arkib
- **Laporan E:** Laporan Tahunan Inovasi Institusi
- **Eksport Berbilang Format:**
  - **PDF Rasmi:** Diformatkan dengan kepala surat institusi Politeknik Banting Selangor, jadual terperinci, tarikh, dan nama penjana laporan.
  - **Excel (XLSX):** Spreadsheet terstruktur dengan tajuk lajur kemas dan kelebaran automatik.
  - **CSV:** Dikodkan dengan UTF-8 BOM bagi memastikan aksara Bahasa Melayu dipaparkan sempurna dalam Microsoft Excel.

### G. Keselamatan & Kawalan Capaian Berasaskan Peranan (RBAC)
Sistem menyokong 5 peranan institusi yang dikuatkuasakan pada peringkat pangkalan data:
1. **Super Admin:** Kawalan mutlak pengguna, tetapan institusi, jabatan, kategori, polisi fail, dan arkib.
2. **Pentadbir UePM:** Menilai pendaftaran, meluluskan produk, mengesahkan pencapaian, dan menjana laporan rasmi.
3. **Pegawai Jabatan:** Menyemak produk di bawah skop jabatan masing-masing (JKM, JPP, dll.).
4. **Pensyarah / Pencipta Produk:** Mendaftar produk, menyimpan draf, mengemaskini draf, menghantar pencapaian, dan memuat naik dokumen.
5. **Pengurusan / Pembaca:** Mod paparan sahaja (read-only) untuk pemantauan pihak pengurusan tertinggi institusi.

### H. Log Aktiviti Kronologi (Audit Trail)
- Rekod jejak transaksi kekal (immutable) bagi setiap log masuk, pendaftaran, kelulusan, pindaan peranan pengguna, dan muat naik dokumen.
- Perlindungan daripada sebarang pengubahsuaian atau pemadaman rekod jejak audit.

---

## 3. Teknologi Pembangunan (Tech Stack)

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Ikon:** Lucide React
- **Visualisasi & Carta:** Recharts
- **Pengurusan Borang & Validasi:** React Hook Form, Zod
- **Penjana Laporan & Eksport:** jsPDF, jsPDF-AutoTable, XLSX
- **Pangkalan Data & Awan:** Firebase Modular SDK v11 (Auth, Cloud Firestore, Firebase Storage) & Persistent Local Storage Engine (sedia luar talian)

---

## 4. Akaun Ujian Pra-Konfigurasi (Demonstrasi Peranan)

Untuk memudahkan pengujian aliran kerja dan kebenaran RBAC, gunakan butang **Pilihan Pantas Peranan** pada skrin log masuk atau pilih identiti berikut:

| Peranan Institusi | E-mel Log Masuk | Kata Laluan | Jabatan | Skop Kuasa |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@polibanting.edu.my` | `password123` | SEMUA | Kawalan mutlak sistem & pengguna |
| **Pentadbir UePM** | `uepm@polibanting.edu.my` | `password123` | SEMUA | Kelulusan arkib & pengesahan pencapaian |
| **Pegawai Jabatan** | `pegawai.jkm@polibanting.edu.my` | `password123` | JKM | Semakan produk peringkat Jabatan JKM |
| **Pensyarah** | `pensyarah.jkm@polibanting.edu.my` | `password123` | JKM | Pendaftaran produk, draf, & pencapaian |
| **Pengurusan** | `pengurusan@polibanting.edu.my` | `password123` | SEMUA | Paparan statistik & laporan (Read-only) |

---

## 5. Panduan Pemasangan & Menjalankan Sistem

### Langkah 1: Klon & Buka Direktori
```bash
cd "c:\Users\user-pc\OneDrive\Desktop\ARKIB ELEARNING"
```

### Langkah 2: Pemasangan Dependensi
```bash
npm install
```

### Langkah 3: Menjalankan Pelayan Pembangunan
```bash
npm run dev
```
Buka pelayar web di `http://localhost:3000`.

### Langkah 4: Ujian Automatik
```bash
npm test
```

### Langkah 5: Binaan Pengeluaran (Production Build)
```bash
npm run build
```

---

## 6. Struktur Direktori Dokumentasi

- [`docs/architecture.md`](docs/architecture.md): Seni bina perisian, model ER dokumen, dan aliran data.
- [`docs/security.md`](docs/security.md): Matriks RBAC, peraturan keselamatan Firestore/Storage, dan polisi keselamatan fail.
- [`docs/deployment.md`](docs/deployment.md): Panduan konfigurasi Firebase, hosting, dan sandaran data.
- [`docs/user-guide-ms.md`](docs/user-guide-ms.md): Manual pengguna dalam Bahasa Melayu untuk pensyarah dan pegawai jabatan.
- [`docs/admin-guide-ms.md`](docs/admin-guide-ms.md): Manual pentadbir dalam Bahasa Melayu untuk Super Admin dan Pentadbir UePM.

---

**SISTEM ARKIB PRODUK INOVASI ePEMBELAJARAN (SAPIe)**  
*Unit ePembelajaran & Multimedia (UePM)*  
**Politeknik Banting Selangor**
