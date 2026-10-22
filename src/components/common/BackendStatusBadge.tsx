import React, { useState } from 'react';
import { Database, Cloud, HardDrive, CheckCircle2, AlertCircle } from 'lucide-react';
import { isFirebaseConfigured } from '../../services/firebase/config';
import { Modal } from './Modal';
import { Button } from './Button';

export const BackendStatusBadge: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border transition-all hover:opacity-90 focus:outline-none"
        style={{
          backgroundColor: isFirebaseConfigured ? '#E6F4EA' : '#FEF3C7',
          borderColor: isFirebaseConfigured ? '#A3D9B8' : '#FCD34D',
          color: isFirebaseConfigured ? '#137333' : '#92400E',
        }}
        title="Klik untuk melihat status sambungan pangkalan data"
      >
        {isFirebaseConfigured ? (
          <>
            <Cloud className="w-3.5 h-3.5 text-emerald-700" />
            <span>Firebase Cloud Live</span>
          </>
        ) : (
          <>
            <HardDrive className="w-3.5 h-3.5 text-amber-700" />
            <span>Storan Setempat Berterusan (Sedia Luar Talian)</span>
          </>
        )}
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Status Integrasi Pangkalan Data SAPIe"
        subtitle="Maklumat seni bina storan & persediaan awan"
        footer={<Button onClick={() => setShowModal(false)}>Tutup</Button>}
      >
        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-gray-50 border border-gray-200">
            {isFirebaseConfigured ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-semibold text-gray-900">
                {isFirebaseConfigured
                  ? 'Tersambung ke Google Firebase Cloud'
                  : 'Beroperasi dalam Mod Storan Tempatan Berterusan (Persistent Local Engine)'}
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                {isFirebaseConfigured
                  ? 'Aplikasi SAPIe sedang berinteraksi terus dengan Firestore dan Firebase Storage rasmi yang telah dikonfigurasikan.'
                  : 'SAPIe beroperasi sepenuhnya dengan enjin pangkalan data berterusan setempat (IndexedDB / LocalStorage Engine) dengan integriti nombor arkib, audit trail, muat naik fail, dan kelulusan tanpa gangguan.'}
              </p>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-gray-900 mb-1.5">Langkah Mengaktifkan Firebase Cloud Sebenar:</h5>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs text-gray-600">
              <li>Buka konsol Firebase di <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-navy-700 underline font-medium">console.firebase.google.com</a> dan cipta projek baharu.</li>
              <li>Aktifkan <strong>Authentication</strong> (Emel/Kata Laluan), <strong>Cloud Firestore</strong>, dan <strong>Firebase Storage</strong>.</li>
              <li>Salin konfigurasi Web App ke dalam fail <code>.env</code> di direktori punca projek:
                <pre className="mt-2 p-2 bg-slate-900 text-slate-100 rounded text-[11px] overflow-x-auto">
{`VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=projek-anda.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=projek-anda
VITE_FIREBASE_STORAGE_BUCKET=projek-anda.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=1:...`}
                </pre>
              </li>
              <li>Jalankan semula aplikasi atau mulakan Firebase Local Emulator untuk ujian keselamatan.</li>
            </ol>
          </div>
        </div>
      </Modal>
    </>
  );
};
