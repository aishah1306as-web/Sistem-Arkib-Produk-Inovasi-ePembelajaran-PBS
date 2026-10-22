# SISTEM ARKIB PRODUK INOVASI ePEMBELAJARAN (SAPIe)
## POLITEKNIK BANTING SELANGOR
### Dokumen Seni Bina Sistem (Architecture Documentation)

---

## 1. Pengenalan & Matlamat Sistem

Sistem Arkib Produk Inovasi ePembelajaran (SAPIe) dibangunkan khusus untuk **Politeknik Banting Selangor** sebagai platform arkib digital berpusat bagi mengurus, memelihara, menilai, menganalisis, dan melaporkan produk-produk inovasi pengajaran dan pembelajaran (PdP) serta pembelajaran digital yang dihasilkan oleh para pensyarah dan staf akademik.

---

## 2. Struktur Modul Utama

SAPIe dibina berasaskan seni bina modular berprestasi tinggi:

```
src/
├── app/                  # Titik masuk utama
├── components/           # Komponen UI boleh diguna semula
│   ├── common/           # Button, Card, Modal, Badge, Tabs, Alert, EmptyState
│   ├── institution/      # Identiti rasmi Politeknik Banting Selangor (PBSLogo)
│   └── layout/           # AppShell, Sidebar (12 menu), TopNavbar, BackendStatusBadge
├── contexts/             # Pengurusan keadaan global (AuthContext, NotificationContext)
├── features/             # Modul fungsian sistem:
│   ├── dashboard/        # 8 kad metrik utama, carta dinamik, tindakan diperlukan
│   ├── products/         # Arkib produk, carian & penapis, profil 7 tab
│   ├── registrations/    # Borang pendaftaran 6 seksyen (A-F), penjana kod arkib
│   ├── achievements/     # Modul pencapaian, pengiktirafan, pengesahan
│   ├── documents/        # Pengurusan dokumen arkib, klasifikasi keselamatan
│   ├── reports/          # Laporan A-E, eksport ke PDF, XLSX, CSV
│   ├── users/            # Pengurusan pengguna & peranan RBAC
│   ├── settings/         # Tetapan institusi, jabatan, kategori, polisi fail
│   ├── audit/            # Jejak audit kronologi (Audit Trail)
│   ├── profile/          # Profil pengguna & tukar kata laluan
│   └── auth/             # Log masuk institusi
├── schemas/              # Skema pengesahan Zod
├── services/             # Lapisan perkhidmatan
│   ├── firebase/         # Konfigurasi Cloud Firebase, Firestore & Storage
│   ├── storage/          # Enjin storan berterusan setempat & pangkalan data
│   ├── export/           # Penjana PDF (jsPDF), Excel (xlsx), CSV (UTF-8)
│   └── seed/             # Skrip data sintetik ujian [SINTETIK - UJIAN]
├── types/                # Definisi jenis data TypeScript ketat
└── utils/                # Utiliti kod arkib, tarikh Bahasa Melayu, validator fail
```

---

## 3. Aliran Kod Arkib Unik Institusi

Setiap produk inovasi yang didaftarkan diberikan kod arkib kekal yang dijana secara selamat berasaskan urutan tahun:

$$\text{Format: } \mathbf{PBS\text{-}EP\text{-}[TAHUN]\text{-}[SIRI\text{ }4\text{ }DIGIT]}$$
*Contoh:* `PBS-EP-2026-0001`, `PBS-EP-2026-0002`

Kod arkib ini dijana secara atomik melalui kaunter transaksi pangkalan data dan kekal terpelihara tanpa diganti selepas produk diluluskan.

---

## 4. Model Data & Hubungan Entiti (ER Model)

Sistem menggunakan model dokumen ternormal dengan koleksi teras:

1. **`products`**: Menyimpan metadata produk, tajuk dinormalkan, penerangan, jabatan, kategori, teknologi, maklumat pencipta, status pembangunan, dan status aliran kerja.
2. **`productMembers`**: Maklumat pensyarah bersama, staf teknikal dan pelajar yang terlibat dalam pembangunan.
3. **`achievements`**: Rekod anugerah, pingat inovasi (Emas, Perak, Gangsa, Johan), peringkat (Institusi, Kebangsaan, Antarabangsa) dan status pengesahan UePM.
4. **`documents`**: Fail sokongan sebenar (PDF, DOCX, XLSX, imej) dengan klasifikasi keselamatan (Awam, Dalaman, Terhad, Sulit) dan sejarah versi.
5. **`users`**: Akaun staf dan pensyarah dengan peranan (Super Admin, Pentadbir UePM, Pegawai Jabatan, Pensyarah, Pengurusan).
6. **`auditLogs`**: Jejak rekod audit yang tidak boleh diubah (immutable) bagi setiap transaksi.
7. **`notifications`**: Pemberitahuan dalam aplikasi (in-app notifications).
8. **`systemSettings`**: Konfigurasi global nama institusi, jabatan, kategori, dan had fail.

---

## 5. Mod Dwi-Enjin Pangkalan Data (Dual-Mode Backend)

Sistem menyokong dua mod operasi telus:
1. **Mod Firebase Cloud Sebenar:**
   - Menyambung terus ke Firebase Authentication, Cloud Firestore, dan Firebase Storage apabila pemboleh ubah persekitaran `.env` dibekalkan.
2. **Mod Storan Tempatan Berterusan (Offline / Persistent Engine):**
   - Apabila kunci awan belum disediakan, sistem beroperasi secara berterusan 100% menggunakan enjin simpanan terasing (localStorage & IndexedDB) dengan tingkah laku transaksi, kaunter kod arkib, muat naik fail, dan jejak audit yang identikal tanpa sebarang manipulasi data palsu.
   - Status mod dipaparkan secara telus melalui lencana *BackendStatusBadge* pada bar navigasi atas.
