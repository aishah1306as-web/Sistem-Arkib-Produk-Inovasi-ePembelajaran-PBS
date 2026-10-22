import React, { useState } from 'react';
import { User, Mail, Shield, Building, Phone, Save, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { UserRoleBadge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { formatDateMs } from '../../utils/dateFormatter';

export const ProfilePage: React.FC = () => {
  const { user, updateCurrentUserProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [staffId, setStaffId] = useState(user?.staffId || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);

  if (!user) return null;

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      fullName,
      staffId,
      phone,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    if (newPassword.length < 6) {
      setPwdError('Kata laluan baharu mestilah sekurang-kurangnya 6 aksara.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('Pengesahan kata laluan tidak sepadan.');
      return;
    }

    setPwdSuccess(true);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPwdSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        title="Profil Pengguna"
        subtitle="Maklumat akaun peribadi dan pengurusan keselamatan kata laluan"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Profil Saya' },
        ]}
      />

      {saveSuccess && (
        <Alert type="success" title="Profil Berjaya Dikemaskini">
          Maklumat peribadi anda telah disimpan ke dalam rekod sistem.
        </Alert>
      )}

      {pwdSuccess && (
        <Alert type="success" title="Kata Laluan Berjaya Ditukar">
          Kata laluan baharu anda telah aktif bagi log masuk seterusnya.
        </Alert>
      )}

      {pwdError && (
        <Alert type="danger" title="Ralat Tukar Kata Laluan">
          {pwdError}
        </Alert>
      )}

      {/* Profile Overview Card */}
      <Card>
        <div className="p-6 bg-navy-900 text-white flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="h-20 w-20 rounded-2xl bg-navy-800 border-2 border-navy-700 flex items-center justify-center font-bold text-2xl text-amber-400 shrink-0">
            {user.fullName.charAt(0)}
          </div>
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-white">{user.fullName}</h2>
              <UserRoleBadge role={user.role} />
            </div>
            <p className="text-xs text-navy-200 mt-1">{user.email}</p>
            <p className="text-xs text-navy-300 mt-0.5">
              Jabatan: <strong>{user.departmentId || 'SEMUA'}</strong> • No. Staf: <strong>{user.staffId || '-'}</strong>
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Form */}
        <Card>
          <CardHeader title="Maklumat Peribadi" subtitle="Kemaskini nama dan maklumat perhubungan" />
          <form onSubmit={handleUpdateProfile}>
            <CardBody className="space-y-4 text-xs">
              <div>
                <label className="label-base">Nama Penuh</label>
                <input
                  type="text"
                  className="input-base"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div>
                <label className="label-base">E-mel Institusi (Tidak boleh diubah)</label>
                <input
                  type="email"
                  disabled
                  className="input-base bg-gray-100 text-gray-500 cursor-not-allowed"
                  value={user.email}
                />
              </div>

              <div>
                <label className="label-base">Nombor Staf</label>
                <input
                  type="text"
                  className="input-base"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                />
              </div>

              <div>
                <label className="label-base">Nombor Telefon</label>
                <input
                  type="text"
                  placeholder="+601..."
                  className="input-base"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </CardBody>
            <CardFooter>
              <Button type="submit" icon={<Save className="w-4 h-4" />}>
                Simpan Profil
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Change Password Form */}
        <Card>
          <CardHeader title="Keselamatan & Kata Laluan" subtitle="Tukar kata laluan akaun anda" />
          <form onSubmit={handleChangePassword}>
            <CardBody className="space-y-4 text-xs">
              <div>
                <label className="label-base">Kata Laluan Semasa</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-base"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="label-base">Kata Laluan Baharu</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-base"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="label-base">Sahkan Kata Laluan Baharu</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-base"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </CardBody>
            <CardFooter>
              <Button type="submit" variant="secondary" icon={<Lock className="w-4 h-4" />}>
                Kemaskini Kata Laluan
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
