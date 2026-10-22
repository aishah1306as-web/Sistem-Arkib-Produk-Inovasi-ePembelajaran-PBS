# SISTEM ARKIB PRODUK INOVASI ePEMBELAJARAN (SAPIe)
## POLITEKNIK BANTING SELANGOR
### Dokumen Keselamatan & Tadbir Urus Data (Security & Data Governance)

---

## 1. Prinsip Utama Keselamatan

Sistem Arkib Produk Inovasi ePembelajaran (SAPIe) mematuhi prinsip keselamatan maklumat institusi pengajian tinggi awam:
- **Deny-by-default:** Segala akses ditolak melainkan dibenarkan secara eksplisit melalui peranan dan status rekod.
- **Role-Based Access Control (RBAC):** Kebenaran dikuatkuasakan di peringkat enjin dan perkhidmatan, bukan sekadar menyembunyikan elemen antaramuka pengguna (UI).
- **Pengasingan Sempadan Jabatan:** Pegawai Jabatan (cth: JKM, JPP) hanya boleh menyemak rekod produk yang berada di bawah jabatan masing-masing.
- **Integriti Rekod Diluluskan:** Produk inovasi yang telah diluluskan secara rasmi ke dalam arkib tidak boleh dipadamkan sewenang-wenangnya melalui aliran biasa (rekod kekal terpelihara bagi tujuan akreditasi MQA & audit kualiti institusi).

---

## 2. Matriks Kebenaran Peranan (RBAC Matrix)

| Modul / Tindakan | Super Admin | Pentadbir UePM | Pegawai Jabatan | Pensyarah / Pencipta | Pengurusan (Read-Only) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Daftar Produk Inovasi** | Ya | Ya | Ya | Ya | Tidak |
| **Simpan Draf & Edit Draf Sendiri** | Ya | Ya | Ya | Ya | Tidak |
| **Luluskan / Tolak Produk ke Arkib** | Ya | Ya | Tidak | Tidak | Tidak |
| **Minta Pembetulan Rekod** | Ya | Ya | Jabatan Sahaja | Tidak | Tidak |
| **Daftar Pencapaian & Anugerah** | Ya | Ya | Ya | Produk Sendiri | Tidak |
| **Sahkan Pencapaian Rasmi** | Ya | Ya | Tidak | Tidak | Tidak |
| **Muat Naik Dokumen Arkib** | Ya | Ya | Jabatan Sahaja | Produk Sendiri | Tidak |
| **Akses Dokumen Sulit / Terhad** | Ya | Ya | Mengikut Jabatan | Uploader Sahaja | Tidak |
| **Jana & Eksport Laporan (PDF/Excel)**| Ya | Ya | Ya | Ya | Ya |
| **Lihat Log Aktiviti (Audit Trail)** | Ya | Ya | Tidak | Tidak | Tidak |
| **Urus Pengguna & Peranan** | Ya | Tidak | Tidak | Tidak | Tidak |
| **Urus Tetapan Sistem & Jabatan** | Ya | Tidak | Tidak | Tidak | Tidak |

---

## 3. Keselamatan Muat Naik Fail & Perlindungan Malware

Untuk mengelakkan pencerobohan dan serangan fail berniat jahat:
1. **Penapisan Format Ketat:**
   - Format dibenarkan: `.pdf`, `.docx`, `.xlsx`, `.pptx`, `.jpg`, `.jpeg`, `.png`, `.webp`, `.zip`.
   - Format eksekusi disekat keras: `.exe`, `.bat`, `.cmd`, `.sh`, `.ps1`, `.vbs`, `.msi`, `.dll`, `.scr`, `.jar`, `.php`, `.asp`.
2. **Had Saiz Maksimum:** Ditetapkan secara lalai kepada 25 MB bagi memastikan kestabilan storan awan dan kelajuan capaian rangkaian kampus.
3. **Penyimpanan Metadata:** Kandungan fail tidak disimpan di dalam pangkalan data Firestore; fail disimpan dalam Cloud Storage dengan nama unik (`storagePath`), manakala metadata disimpan dalam dokumen Firestore.

---

## 4. Dasar Audit Trail Tidak Boleh Diubah (Immutable Audit Logs)

Semua tindakan penting direkodkan secara automatik ke dalam koleksi `auditLogs`:
- Log Masuk (LOGIN) & Log Keluar (LOGOUT)
- Pendaftaran Produk (PRODUCT_CREATE, PRODUCT_SUBMIT)
- Kelulusan Produk (PRODUCT_APPROVE)
- Penolakan & Permintaan Pembetulan (PRODUCT_REJECT, PRODUCT_CORRECTION)
- Pengesahan Pencapaian (ACHIEVEMENT_VERIFY)
- Muat Naik & Pemadaman Dokumen (DOCUMENT_UPLOAD)
- Pertukaran Peranan & Status Pengguna (USER_ROLE_CHANGE, USER_STATUS_CHANGE)
- Pengemaskinian Tetapan Pentadbiran (SETTINGS_UPDATE)

Rekod jejak audit dilindungi oleh Firestore Security Rules daripada sebarang kemas kini (`update: false`) atau pemadaman (`delete: false`).
