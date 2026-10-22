import React, { useState } from 'react';
import {
  Settings,
  Building2,
  FolderTree,
  Tag,
  Shield,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
} from 'lucide-react';
import { dbService } from '../../services/storage/databaseService';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { SystemSettings } from '../../types/settings';

export const SystemSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SystemSettings>(() => dbService.getSystemSettings());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'umum' | 'jabatan' | 'kategori' | 'fail'>('umum');

  // New dept / cat inputs
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptName, setNewDeptName] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newTechTag, setNewTechTag] = useState('');

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    dbService.updateSystemSettings(settings, user);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleAddDept = () => {
    if (!newDeptCode.trim() || !newDeptName.trim() || !user) return;
    const updatedDepts = [
      ...settings.departments,
      {
        departmentId: newDeptCode.trim().toUpperCase(),
        code: newDeptCode.trim().toUpperCase(),
        name: newDeptName.trim(),
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    const updated = dbService.updateSystemSettings({ departments: updatedDepts }, user);
    setSettings(updated);
    setNewDeptCode('');
    setNewDeptName('');
  };

  const handleRemoveDept = (code: string) => {
    if (!user) return;
    if (window.confirm(`Adakah anda pasti ingin memadam jabatan ${code}?`)) {
      const updatedDepts = settings.departments.filter((d) => d.code !== code);
      const updated = dbService.updateSystemSettings({ departments: updatedDepts }, user);
      setSettings(updated);
    }
  };

  const handleAddCategory = () => {
    if (!newCatName.trim() || !user) return;
    const updatedCats = [
      ...settings.categories,
      {
        categoryId: `cat-${Date.now()}`,
        name: newCatName.trim(),
        description: newCatDesc.trim() || undefined,
        active: true,
        sortOrder: settings.categories.length + 1,
      },
    ];
    const updated = dbService.updateSystemSettings({ categories: updatedCats }, user);
    setSettings(updated);
    setNewCatName('');
    setNewCatDesc('');
  };

  const handleRemoveCategory = (id: string) => {
    if (!user) return;
    const updatedCats = settings.categories.filter((c) => c.categoryId !== id);
    const updated = dbService.updateSystemSettings({ categories: updatedCats }, user);
    setSettings(updated);
  };

  const handleAddTechTag = () => {
    if (!newTechTag.trim() || !user) return;
    if (settings.technologies.includes(newTechTag.trim())) return;
    const updated = dbService.updateSystemSettings(
      { technologies: [...settings.technologies, newTechTag.trim()] },
      user
    );
    setSettings(updated);
    setNewTechTag('');
  };

  const handleRemoveTechTag = (tag: string) => {
    if (!user) return;
    const updated = dbService.updateSystemSettings(
      { technologies: settings.technologies.filter((t) => t !== tag) },
      user
    );
    setSettings(updated);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Tetapan Sistem SAPIe"
        subtitle="Konfigurasi institusi, struktur jabatan, taksonomi kategori dan polisi keselamatan arkib"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Tetapan Sistem' },
        ]}
      />

      {saveSuccess && (
        <Alert type="success" title="Tetapan Berjaya Dikemaskini">
          Semua konfigurasi sistem SAPIe telah disimpan ke dalam pangkalan data dan direkodkan dalam log aktiviti.
        </Alert>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('umum')}
          className={`px-3 py-2 rounded-lg transition-colors ${
            activeTab === 'umum' ? 'bg-navy-800 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Konfigurasi Umum
        </button>
        <button
          onClick={() => setActiveTab('jabatan')}
          className={`px-3 py-2 rounded-lg transition-colors ${
            activeTab === 'jabatan' ? 'bg-navy-800 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Struktur Jabatan ({settings.departments.length})
        </button>
        <button
          onClick={() => setActiveTab('kategori')}
          className={`px-3 py-2 rounded-lg transition-colors ${
            activeTab === 'kategori' ? 'bg-navy-800 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Kategori & Teknologi
        </button>
        <button
          onClick={() => setActiveTab('fail')}
          className={`px-3 py-2 rounded-lg transition-colors ${
            activeTab === 'fail' ? 'bg-navy-800 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Had Fail & Keselamatan
        </button>
      </div>

      {/* Tab 1: General Settings */}
      {activeTab === 'umum' && (
        <Card>
          <CardHeader title="Maklumat Identiti Institusi & Format Kod Arkib" />
          <form onSubmit={handleSaveGeneral}>
            <CardBody className="space-y-4 text-xs">
              <div>
                <label className="label-base">Nama Institusi</label>
                <input
                  type="text"
                  className="input-base"
                  value={settings.institutionName}
                  onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-base">Nama Sistem</label>
                  <input
                    type="text"
                    className="input-base"
                    value={settings.systemName}
                    onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="label-base">Nama Ringkas Sistem (Singkatan)</label>
                  <input
                    type="text"
                    className="input-base"
                    value={settings.systemShortName}
                    onChange={(e) => setSettings({ ...settings, systemShortName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label-base">Awalan Kod Arkib (Prefix)</label>
                  <input
                    type="text"
                    className="input-base font-mono font-bold"
                    value={settings.archiveCodePrefix}
                    onChange={(e) => setSettings({ ...settings, archiveCodePrefix: e.target.value })}
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Format: {settings.archiveCodePrefix}-2026-0001
                  </p>
                </div>

                <div>
                  <label className="label-base">Tahun Semasa Institusi</label>
                  <input
                    type="number"
                    className="input-base"
                    value={settings.currentAcademicYear}
                    onChange={(e) =>
                      setSettings({ ...settings, currentAcademicYear: parseInt(e.target.value) || 2026 })
                    }
                  />
                </div>

                <div>
                  <label className="label-base">E-mel Perhubungan Pentadbir Arkib</label>
                  <input
                    type="email"
                    className="input-base"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  />
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <Button type="submit" icon={<Save className="w-4 h-4" />}>
                Simpan Tetapan Umum
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Tab 2: Departments */}
      {activeTab === 'jabatan' && (
        <Card>
          <CardHeader
            title="Pengurusan Jabatan Akademik"
            subtitle="Jabatan di bawah naungan Politeknik Banting Selangor"
          />
          <CardBody className="space-y-4 text-xs">
            {/* Add Dept Form */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col md:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Kod Jabatan (cth: JKM)"
                className="input-base md:w-36 uppercase font-mono font-bold"
                value={newDeptCode}
                onChange={(e) => setNewDeptCode(e.target.value)}
              />
              <input
                type="text"
                placeholder="Nama Penuh Jabatan (cth: Jabatan Kejuruteraan Mekanikal)"
                className="input-base flex-1"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
              />
              <Button size="sm" onClick={handleAddDept} icon={<Plus className="w-3.5 h-3.5" />}>
                Tambah
              </Button>
            </div>

            <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
              {settings.departments.map((d) => (
                <div key={d.code} className="p-3 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <span className="font-mono font-bold text-navy-800 mr-2">{d.code}</span>
                    <span className="font-semibold text-gray-900">{d.name}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveDept(d.code)}
                    className="p-1 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    title="Padam Jabatan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Tab 3: Categories & Technologies */}
      {activeTab === 'kategori' && (
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Kategori Produk Inovasi"
              subtitle="Klasifikasi rasmi format produk inovasi pembelajaran"
            />
            <CardBody className="space-y-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col md:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Nama Kategori Baharu"
                  className="input-base flex-1"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Penerangan ringkas (Pilihan)"
                  className="input-base flex-1"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                />
                <Button size="sm" onClick={handleAddCategory} icon={<Plus className="w-3.5 h-3.5" />}>
                  Tambah
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {settings.categories.map((c) => (
                  <div key={c.categoryId} className="p-2.5 rounded-lg border border-gray-200 flex items-center justify-between bg-white text-xs">
                    <div>
                      <div className="font-semibold text-gray-900">{c.name}</div>
                      {c.description && <div className="text-[10px] text-gray-500 mt-0.5">{c.description}</div>}
                    </div>
                    <button
                      onClick={() => handleRemoveCategory(c.categoryId)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Tag Teknologi & Platform Digital"
              subtitle="Senarai platform yang boleh dipilih semasa pendaftaran produk"
            />
            <CardBody className="space-y-4 text-xs">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nama Platform / Alat (cth: Articulate Storyline, Blender)"
                  className="input-base max-w-md"
                  value={newTechTag}
                  onChange={(e) => setNewTechTag(e.target.value)}
                />
                <Button size="sm" onClick={handleAddTechTag} icon={<Plus className="w-3.5 h-3.5" />}>
                  Tambah Tag
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {settings.technologies.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold"
                  >
                    <span>{t}</span>
                    <button
                      onClick={() => handleRemoveTechTag(t)}
                      className="hover:text-rose-600 text-slate-400 font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Tab 4: File Limits & Security */}
      {activeTab === 'fail' && (
        <Card>
          <CardHeader
            title="Had Saiz Fail & Polisi Keselamatan Muat Naik"
            subtitle="Kawalan jenis fail dan had storan arkib digital"
          />
          <form onSubmit={handleSaveGeneral}>
            <CardBody className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-base">Had Saiz Fail Maksimum (MB)</label>
                  <input
                    type="number"
                    className="input-base"
                    value={settings.maxFileSizeMB}
                    onChange={(e) =>
                      setSettings({ ...settings, maxFileSizeMB: parseInt(e.target.value) || 25 })
                    }
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Had piawai institusi: 25 MB bagi setiap dokumen atau imej.
                  </p>
                </div>

                <div>
                  <label className="label-base">Tempoh Pengekalan Arkib (Tahun)</label>
                  <input
                    type="number"
                    className="input-base"
                    value={settings.retentionPolicyYears}
                    onChange={(e) =>
                      setSettings({ ...settings, retentionPolicyYears: parseInt(e.target.value) || 7 })
                    }
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Dasar arkib rasmi: Pengekalan sekurang-kurangnya 7 tahun bagi tujuan audit kualiti MQA.
                  </p>
                </div>
              </div>

              <div>
                <label className="label-base">Jenis Fail Dibenarkan</label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-700">
                  {settings.allowedFileTypes.join(', ')}
                </div>
                <p className="text-[10px] text-rose-600 font-medium mt-1">
                  * Fail eksekusi (.exe, .bat, .sh, .dll) disekat secara mutlak oleh enjin keselamatan sistem.
                </p>
              </div>
            </CardBody>
            <CardFooter>
              <Button type="submit" icon={<Save className="w-4 h-4" />}>
                Simpan Polisi Fail
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
};
