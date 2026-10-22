import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Edit2,
  CheckCircle,
  XCircle,
  Building,
} from 'lucide-react';
import { dbService } from '../../services/storage/databaseService';
import { useAuth } from '../../contexts/AuthContext';
import { userManagementSchema, UserManagementFormData } from '../../schemas/userSchema';
import { UserProfile, UserRole } from '../../types/auth';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { UserRoleBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Alert } from '../../components/common/Alert';
import { formatDateMs } from '../../utils/dateFormatter';

export const UserManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState<UserProfile[]>(() => dbService.getUsers());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const settings = dbService.getSystemSettings();
  const departments = settings.departments || [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserManagementFormData>({
    resolver: zodResolver(userManagementSchema),
    defaultValues: {
      fullName: '',
      email: '',
      staffId: '',
      role: 'pensyarah',
      departmentId: 'JKM',
      active: true,
      password: '',
    },
  });

  const reloadUsers = () => {
    setUsersList(dbService.getUsers());
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    reset({
      fullName: '',
      email: '',
      staffId: '',
      role: 'pensyarah',
      departmentId: 'JKM',
      active: true,
      password: '',
    });
    setErrorMsg(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (target: UserProfile) => {
    setEditingUser(target);
    setValue('fullName', target.fullName);
    setValue('email', target.email);
    setValue('staffId', target.staffId || '');
    setValue('role', target.role);
    setValue('departmentId', target.departmentId || 'JKM');
    setValue('active', target.active);
    setErrorMsg(null);
    setShowAddModal(true);
  };

  const onSubmit = (data: UserManagementFormData) => {
    if (!user) return;
    setErrorMsg(null);

    try {
      if (editingUser) {
        dbService.updateUser(
          editingUser.uid,
          {
            fullName: data.fullName,
            role: data.role,
            departmentId: data.departmentId,
            active: data.active,
            staffId: data.staffId,
          },
          user
        );
      } else {
        dbService.createUser(
          {
            email: data.email,
            fullName: data.fullName,
            role: data.role,
            departmentId: data.departmentId,
            staffId: data.staffId,
            active: data.active,
          },
          user
        );
      }

      reloadUsers();
      setShowAddModal(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Ralat semasa menyimpan rekod pengguna.');
    }
  };

  const toggleUserStatus = (target: UserProfile) => {
    if (!user) return;
    if (target.uid === user.uid) {
      alert('Anda tidak boleh menyahaktifkan akaun anda sendiri.');
      return;
    }
    dbService.updateUser(target.uid, { active: !target.active }, user);
    reloadUsers();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <PageHeader
        title="Pengurusan Pengguna & Kawalan Akses (RBAC)"
        subtitle="Pentadbiran akaun staf, penetapan peranan institusi, dan jabatan berkaitan"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Pengurusan Pengguna' },
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAdd}
            icon={<UserPlus className="w-3.5 h-3.5" />}
          >
            Daftar Pengguna Baharu
          </Button>
        }
      />

      <Card>
        <CardHeader
          title="Senarai Pengguna Berdaftar"
          subtitle="Akses terhad kepada Super Admin sahaja"
        />
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-navy-800 text-white font-semibold">
                <tr>
                  <th className="py-3 px-4">Nama Penuh</th>
                  <th className="py-3 px-4">E-mel Institusi</th>
                  <th className="py-3 px-4">No. Staf</th>
                  <th className="py-3 px-4">Jabatan</th>
                  <th className="py-3 px-4">Peranan</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usersList.map((u) => (
                  <tr key={u.uid} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-900">{u.fullName}</td>
                    <td className="py-3 px-4 text-gray-600">{u.email}</td>
                    <td className="py-3 px-4 font-mono text-gray-500">{u.staffId || '-'}</td>
                    <td className="py-3 px-4 text-gray-700">{u.departmentId || 'SEMUA'}</td>
                    <td className="py-3 px-4">
                      <UserRoleBadge role={u.role} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          u.active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.active ? 'Aktif' : 'Nyahaktif'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(u)}>
                        <Edit2 className="w-3.5 h-3.5 text-navy-700" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleUserStatus(u)}
                        title={u.active ? 'Nyahaktifkan Pengguna' : 'Aktifkan Pengguna'}
                      >
                        {u.active ? (
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingUser ? 'Kemaskini Pengguna' : 'Daftar Pengguna Baharu'}
        subtitle="Maklumat akses dan peranan pengguna dalam SAPIe"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
          {errorMsg && <Alert type="danger">{errorMsg}</Alert>}

          <div>
            <label className="label-base">Nama Penuh <span className="text-rose-500">*</span></label>
            <input type="text" className="input-base" {...register('fullName')} />
            {errors.fullName && <p className="text-rose-600 mt-1">{errors.fullName.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="label-base">Alamat E-mel <span className="text-rose-500">*</span></label>
              <input
                type="email"
                className="input-base"
                disabled={Boolean(editingUser)}
                {...register('email')}
              />
              {errors.email && <p className="text-rose-600 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label-base">Nombor Staf</label>
              <input type="text" placeholder="PBS-..." className="input-base" {...register('staffId')} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="label-base">Peranan Pengguna (Role) <span className="text-rose-500">*</span></label>
              <select className="input-base" {...register('role')}>
                <option value="pensyarah">Pensyarah / Pencipta Produk</option>
                <option value="pegawai_jabatan">Pegawai Jabatan</option>
                <option value="pentadbir_uepm">Pentadbir UePM</option>
                <option value="pengurusan">Pengurusan / Pembaca</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <div>
              <label className="label-base">Jabatan Pengguna</label>
              <select className="input-base" {...register('departmentId')}>
                <option value="SEMUA">Semua Jabatan (Peringkat Institusi)</option>
                {departments.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="userActiveCheck" {...register('active')} className="rounded text-navy-800" />
            <label htmlFor="userActiveCheck" className="text-gray-700 font-medium">
              Akaun Aktif (Dibenarkan Log Masuk)
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
              Batal
            </Button>
            <Button type="submit">
              {editingUser ? 'Simpan Perubahan' : 'Daftar Pengguna'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
