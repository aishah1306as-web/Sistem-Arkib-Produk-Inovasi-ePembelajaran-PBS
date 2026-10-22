# SISTEM ARKIB PRODUK INOVASI ePEMBELAJARAN (SAPIe)
## POLITEKNIK BANTING SELANGOR
### Panduan Pelaksanaan & Penerapan Pengeluaran (Deployment Guide)

---

## 1. Pra-Syarat & Keperluan Pelayan

Untuk menjalankan sistem SAPIe dalam persekitaran pengeluaran institusi (production):
- **Node.js:** Versi LTS (v20.x atau lebih terkini)
- **NPM:** v10.x atau lebih terkini
- **Pelayan Web / Hosting:** Firebase Hosting, Nginx, Apache, atau perkhidmatan Cloud Run / VPS institusi.
- **Akaun Google Cloud / Firebase:** Projek Firebase didaftarkan dengan pelan bersesuaian (Spark / Blaze).

---

## 2. Langkah Penyediaan Projek Firebase

1. **Cipta Projek di Konsol Firebase:**
   - Layari [console.firebase.google.com](https://console.firebase.google.com).
   - Klik **Add Project** dan namakan projek (cth: `sapie-polibanting`).
2. **Aktifkan Firebase Authentication:**
   - Pergi ke menu **Authentication** > **Sign-in method**.
   - Aktifkan pembekal **Email/Password**.
3. **Konfigurasi Cloud Firestore:**
   - Pergi ke **Firestore Database** > **Create database**.
   - Pilih lokasi rantau terdekat (cth: `asia-southeast1` - Singapura untuk kependaman minimum).
   - Mulakan dalam mod kunci keselamatan (*Production mode*).
4. **Konfigurasi Firebase Storage:**
   - Pergi ke **Storage** > **Get started**.
   - Gunakan baldi storan piawai institusi.
5. **Daftarkan Web App:**
   - Pergi ke **Project Settings** > **General** > **Your apps** > Pilih ikon Web `</>`.
   - Daftarkan nama aplikasi `SAPIe Frontend`.
   - Salin maklumat konfigurasi Firebase SDK.

---

## 3. Konfigurasi Pemboleh Ubah Persekitaran (`.env`)

Salin templat daripada `.env.example` ke fail `.env` pada direktori utama:

```bash
cp .env.example .env
```

Masukkan nilai sebenar yang diperoleh daripada Konsol Firebase:

```ini
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=sapie-polibanting.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=sapie-polibanting
VITE_FIREBASE_STORAGE_BUCKET=sapie-polibanting.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_USE_FIREBASE_EMULATOR=false
VITE_APP_ENV=production
```

> **PERINGATAN KESELAMATAN INSTITUSI:**
> Jangan sekali-kali meletakkan kunci persendirian akaun perkhidmatan (*Firebase Admin SDK service account key*) atau kata laluan pangkalan data ke dalam fail persekitaran frontend!

---

## 4. Penggunaan Peraturan Keselamatan (Security Rules Deployment)

Pasang Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
firebase use --add sapie-polibanting
```

Gunakan peraturan keselamatan Firestore & Storage yang disediakan dalam direktori `firebase/`:
```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

---

## 5. Kompilasi & Binaan Pengeluaran (Production Build)

Jalankan perintah pengesahan jenis TypeScript dan binaan bundle:

```bash
npm run build
```

Hasil kompilasi optimum yang sedia untuk dihoskan akan dijana dalam direktori `dist/`.

---

## 6. Penerapan ke Firebase Hosting

```bash
firebase deploy --only hosting
```

Aplikasi kini boleh diakses melalui domain rasmi yang didaftarkan (cth: `https://sapie.polibanting.edu.my`).

---

## 7. Prosedur Sandaran & Pemulihan Data (Backup & Restoration)

### A. Sandaran Automatik Cloud Firestore
Jadualkan eksport berkala menggunakan Google Cloud Scheduler dan Cloud Functions:
```bash
gcloud firestore export gs://[BUCKET_SANDARAN_PBS]/backups/$(date +%Y%m%d)
```

### B. Pemulihan Data (Restoration)
Untuk memulihkan data daripada sandaran tertentu:
```bash
gcloud firestore import gs://[BUCKET_SANDARAN_PBS]/backups/[TARIKH_SANDARAN]
```
