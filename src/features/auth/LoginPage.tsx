import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PBSLogo } from '../../components/institution/PBSBranding';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { INITIAL_USERS } from '../../services/storage/initialData';

export const LoginPage: React.FC = () => {
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('superadmin@polibanting.edu.my');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLocalError(null);

    const success = await login(email, password);
    setIsSubmitting(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  const handleQuickLogin = async (presetEmail: string) => {
    setEmail(presetEmail);
    setIsSubmitting(true);
    const success = await login(presetEmail, 'password123');
    setIsSubmitting(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-appbg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4">
          <PBSLogo size="lg" variant="light" />
        </div>
        <h2 className="text-xl font-bold text-navy-900 tracking-tight">
          Sistem Arkib Produk Inovasi ePembelajaran (SAPIe)
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Portal Rasmi Pengurusan & Pemeliharaan Inovasi Digital Pembelajaran
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-gray-200/80 rounded-2xl sm:px-10">
          {(error || localError) && (
            <div className="mb-4">
              <Alert type="danger" title="Ralat Log Masuk">
                {error || localError}
              </Alert>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="label-base">Alamat E-mel Institusi</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@polibanting.edu.my"
                  className="input-base pl-9 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="label-base">Kata Laluan</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-base pl-9 text-xs"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              className="w-full mt-2"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Log Masuk ke SAPIe
            </Button>
          </form>

          {/* Quick Preset Buttons for Evaluation / Testing */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              <UserCheck className="w-4 h-4 text-navy-700" />
              <span>Pilihan Pantas Peranan (Demonstrasi):</span>
            </div>
            <p className="text-[11px] text-gray-500 mb-3">
              Klik profil di bawah untuk menguji kebenaran peranan (Role-Based Access Control) secara serta-merta:
            </p>

            <div className="space-y-2">
              {INITIAL_USERS.map((u) => (
                <button
                  key={u.uid}
                  type="button"
                  onClick={() => handleQuickLogin(u.email)}
                  className="w-full text-left p-2.5 rounded-lg border border-gray-200 hover:border-navy-400 hover:bg-navy-50/50 transition-all flex items-center justify-between group text-xs"
                >
                  <div>
                    <span className="font-semibold text-gray-900 group-hover:text-navy-900">
                      {u.fullName}
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      {u.email}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-700 group-hover:bg-navy-100 group-hover:text-navy-800">
                    {u.role.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          Hak Cipta Terpelihara © {new Date().getFullYear()} Politeknik Banting Selangor.
        </div>
      </div>
    </div>
  );
};
