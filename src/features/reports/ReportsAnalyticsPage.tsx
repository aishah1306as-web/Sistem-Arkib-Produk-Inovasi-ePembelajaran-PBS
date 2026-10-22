import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  FileSpreadsheet,
  FileDown,
  FileText,
  Filter,
  CheckCircle2,
  Calendar,
  Building,
  Trophy,
  Package,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { dbService } from '../../services/storage/databaseService';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { formatDateMs } from '../../utils/dateFormatter';
import {
  exportProductsToExcel,
  exportProductsToPDF,
  exportProductsToCSV,
  exportAchievementsToExcel,
  exportAchievementsToPDF,
} from '../../services/export/exportServices';

export const ReportsAnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState<
    'keseluruhan' | 'pencapaian' | 'impak' | 'kelengkapan' | 'tahunan'
  >('keseluruhan');

  const [selectedYear, setSelectedYear] = useState<string>('SEMUA');
  const [selectedDept, setSelectedDept] = useState<string>('SEMUA');

  const settings = dbService.getSystemSettings();
  const departments = settings.departments || [];

  // Filtered dataset
  const filteredProducts = useMemo(() => {
    return dbService.getProducts({
      year: selectedYear === 'SEMUA' ? undefined : parseInt(selectedYear),
      departmentId: selectedDept === 'SEMUA' ? undefined : selectedDept,
    });
  }, [selectedYear, selectedDept]);

  const filteredAchievements = useMemo(() => {
    return dbService.getAchievements({
      year: selectedYear === 'SEMUA' ? undefined : parseInt(selectedYear),
      departmentId: selectedDept === 'SEMUA' ? undefined : selectedDept,
    });
  }, [selectedYear, selectedDept]);

  const filteredDocs = useMemo(() => {
    return dbService.getDocuments({
      year: selectedYear === 'SEMUA' ? undefined : parseInt(selectedYear),
      departmentId: selectedDept === 'SEMUA' ? undefined : selectedDept,
    });
  }, [selectedYear, selectedDept]);

  // Computations
  const approvedCount = filteredProducts.filter((p) => p.registrationStatus === 'Diluluskan').length;
  const verifiedAchievementsCount = filteredAchievements.filter((a) => a.verificationStatus === 'Disahkan').length;

  // Completeness check
  const incompleteProducts = filteredProducts.filter(
    (p) => !p.summary || !p.objectives || !p.problemStatement || !p.pedagogicalMethod
  );

  // Export handlers
  const handleExportPDF = () => {
    if (selectedReport === 'pencapaian') {
      exportAchievementsToPDF(filteredAchievements, {
        title: 'Laporan Rasmi Pencapaian Produk Inovasi',
        generatedByName: user?.fullName || 'Pengguna',
        generatedDate: new Date().toISOString(),
        yearFilter: selectedYear,
        departmentFilter: selectedDept,
      });
    } else {
      exportProductsToPDF(filteredProducts, {
        title: `Laporan Rasmi Arkib - ${
          selectedReport === 'keseluruhan'
            ? 'Keseluruhan Produk'
            : selectedReport === 'impak'
            ? 'Penggunaan & Impak PdP'
            : selectedReport === 'kelengkapan'
            ? 'Kelengkapan Arkib'
            : 'Laporan Tahunan Institusi'
        }`,
        generatedByName: user?.fullName || 'Pengguna',
        generatedDate: new Date().toISOString(),
        yearFilter: selectedYear,
        departmentFilter: selectedDept,
      });
    }
  };

  const handleExportExcel = () => {
    if (selectedReport === 'pencapaian') {
      exportAchievementsToExcel(filteredAchievements);
    } else {
      exportProductsToExcel(filteredProducts, {
        title: 'Laporan Arkib SAPIe',
        generatedByName: user?.fullName || 'Pengguna',
        generatedDate: new Date().toISOString(),
        yearFilter: selectedYear,
        departmentFilter: selectedDept,
      });
    }
  };

  const handleExportCSV = () => {
    exportProductsToCSV(filteredProducts);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <PageHeader
        title="Pusat Analitik & Laporan Institusi"
        subtitle="Jana dan eksport laporan rasmi pencapaian produk inovasi digital Politeknik Banting Selangor"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Analitik & Laporan' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              icon={<FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Eksport Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              icon={<FileDown className="w-3.5 h-3.5 text-rose-600" />}
            >
              Jana PDF Rasmi
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              icon={<FileText className="w-3.5 h-3.5 text-blue-600" />}
            >
              Eksport CSV
            </Button>
          </div>
        }
      />

      {/* Top Filter Bar */}
      <Card>
        <CardBody className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Penapis Laporan:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="input-base text-xs py-1.5 w-auto"
            >
              <option value="SEMUA">Semua Tahun</option>
              <option value="2026">Tahun 2026</option>
              <option value="2025">Tahun 2025</option>
              <option value="2024">Tahun 2024</option>
            </select>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="input-base text-xs py-1.5 w-auto"
            >
              <option value="SEMUA">Semua Jabatan</option>
              {departments.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.code} - {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-gray-500 text-right">
            <span>
              Tarikh Penjanaan: <strong>{formatDateMs(new Date())}</strong> | Dijana oleh:{' '}
              <strong>{user?.fullName}</strong>
            </span>
          </div>
        </CardBody>
      </Card>

      {/* Report Types Selection Pills */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { id: 'keseluruhan', label: 'A. Keseluruhan Produk', icon: Package },
          { id: 'pencapaian', label: 'B. Rekod Pencapaian', icon: Trophy },
          { id: 'impak', label: 'C. Penggunaan & Impak', icon: CheckCircle2 },
          { id: 'kelengkapan', label: 'D. Kelengkapan Arkib', icon: AlertCircle },
          { id: 'tahunan', label: 'E. Tahunan Institusi', icon: Calendar },
        ].map((r) => {
          const Icon = r.icon;
          const isSelected = selectedReport === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setSelectedReport(r.id as any)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-navy-800 text-white border-navy-800 shadow-md ring-2 ring-navy-500/20'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-amber-400' : 'text-navy-700'}`} />
              <div className="text-xs font-bold leading-tight">{r.label}</div>
            </button>
          );
        })}
      </div>

      {/* Report Content Panels */}
      {selectedReport === 'keseluruhan' && (
        <Card>
          <CardHeader
            title="Laporan A: Keseluruhan Produk Inovasi ePembelajaran"
            subtitle="Ringkasan pendaftaran produk berstatus kelulusan merentasi jabatan"
          />
          <CardBody className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-navy-50 border border-navy-100">
                <span className="text-[10px] font-bold text-navy-600 uppercase">Jumlah Produk Berdaftar</span>
                <p className="text-2xl font-black text-navy-900 mt-1">{filteredProducts.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Produk Diluluskan</span>
                <p className="text-2xl font-black text-emerald-900 mt-1">{approvedCount}</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <span className="text-[10px] font-bold text-amber-600 uppercase">Dalam Semakan</span>
                <p className="text-2xl font-black text-amber-900 mt-1">
                  {filteredProducts.filter((p) => p.registrationStatus === 'Dalam Semakan' || p.registrationStatus === 'Dihantar untuk Semakan').length}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Kadar Kelulusan</span>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {filteredProducts.length > 0
                    ? `${Math.round((approvedCount / filteredProducts.length) * 100)}%`
                    : '0%'}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-navy-800 text-white font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Kod Arkib</th>
                    <th className="py-2.5 px-3">Tajuk Produk</th>
                    <th className="py-2.5 px-3">Jabatan</th>
                    <th className="py-2.5 px-3">Pencipta Utama</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Pencapaian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.productId} className="hover:bg-gray-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-navy-800">{p.archiveCode}</td>
                      <td className="py-2.5 px-3 font-semibold text-gray-900">{p.title}</td>
                      <td className="py-2.5 px-3 text-gray-600">{p.departmentId}</td>
                      <td className="py-2.5 px-3 text-gray-700">{p.primaryCreatorName}</td>
                      <td className="py-2.5 px-3">{p.registrationStatus}</td>
                      <td className="py-2.5 px-3 font-bold text-amber-700">{p.achievementsCount || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {selectedReport === 'pencapaian' && (
        <Card>
          <CardHeader
            title="Laporan B: Pencapaian & Pengiktirafan Rasmi"
            subtitle="Senarai rekod pingat, anugerah inovasi dan pengesahan peringkat institusi, kebangsaan dan antarabangsa"
          />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase">Jumlah Pencapaian Disahkan</span>
                <p className="text-2xl font-black text-amber-900 mt-1">{verifiedAchievementsCount}</p>
              </div>
              <div className="p-4 rounded-xl bg-navy-50 border border-navy-200">
                <span className="text-[10px] font-bold text-navy-800 uppercase">Rekod Dalam Semakan</span>
                <p className="text-2xl font-black text-navy-900 mt-1">
                  {filteredAchievements.filter((a) => a.verificationStatus === 'Dalam Semakan').length}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                <span className="text-[10px] font-bold text-purple-800 uppercase">Peringkat Kebangsaan / Antarabangsa</span>
                <p className="text-2xl font-black text-purple-900 mt-1">
                  {filteredAchievements.filter((a) => a.recognitionLevel === 'Kebangsaan' || a.recognitionLevel === 'Antarabangsa').length}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-navy-800 text-white font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Tajuk Pencapaian</th>
                    <th className="py-2.5 px-3">Produk</th>
                    <th className="py-2.5 px-3">Pertandingan / Acara</th>
                    <th className="py-2.5 px-3">Peringkat</th>
                    <th className="py-2.5 px-3">Keputusan</th>
                    <th className="py-2.5 px-3">Status Pengesahan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAchievements.map((a) => (
                    <tr key={a.achievementId} className="hover:bg-gray-50">
                      <td className="py-2.5 px-3 font-semibold text-gray-900">{a.title}</td>
                      <td className="py-2.5 px-3 font-mono text-navy-800">{a.productArchiveCode || '-'}</td>
                      <td className="py-2.5 px-3 text-gray-600">{a.eventName}</td>
                      <td className="py-2.5 px-3 text-gray-700">{a.recognitionLevel}</td>
                      <td className="py-2.5 px-3 font-bold text-amber-700">{a.resultType}</td>
                      <td className="py-2.5 px-3">{a.verificationStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {selectedReport === 'impak' && (
        <Card>
          <CardHeader
            title="Laporan C: Penggunaan & Impak Pembelajaran"
            subtitle="Produk yang mempunyai bukti pelaksanaan PdP dan penilaian amali berkesan"
          />
          <CardBody className="space-y-4">
            <p className="text-xs text-gray-600">
              Menyenaraikan produk yang telah siap dibangunkan dan mempunyai dokumentasi pelaksanaan dalam sesi amali pembelajaran pelajar:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts
                .filter((p) => p.developmentStatus === 'Sedia Digunakan' || p.developmentStatus === 'Selesai & Diarkibkan')
                .map((p) => (
                  <div key={p.productId} className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-navy-800">{p.archiveCode}</span>
                      <Badge variant="success" size="sm">{p.developmentStatus}</Badge>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900">{p.title}</h4>
                    <p className="text-xs text-gray-600"><strong>Kaedah PdP:</strong> {p.pedagogicalMethod}</p>
                    <p className="text-xs text-gray-600"><strong>Sasaran:</strong> {p.targetAudience}</p>
                    {p.implementationNotes && (
                      <div className="p-2 bg-white rounded border border-gray-200 text-xs text-gray-700 mt-1">
                        <strong>Nota Impak:</strong> {p.implementationNotes}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </CardBody>
        </Card>
      )}

      {selectedReport === 'kelengkapan' && (
        <Card>
          <CardHeader
            title="Laporan D: Kelengkapan Arkib & Audit Rekod"
            subtitle="Mengenal pasti produk yang memerlukan penambahbaikan maklumat atau dokumen sokongan"
          />
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
              <span>
                Jumlah rekod dikesan dengan kelengkapan tidak sempurna:{' '}
                <strong>{incompleteProducts.length} produk</strong>
              </span>
            </div>

            {incompleteProducts.length === 0 ? (
              <div className="p-6 text-center text-xs text-emerald-700 font-semibold">
                ✓ Semua rekod produk inovasi mempunyai profil maklumat asas yang lengkap.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                {incompleteProducts.map((p) => (
                  <div key={p.productId} className="p-3 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-navy-800">{p.archiveCode}</span>
                      <h5 className="font-semibold text-gray-900">{p.title}</h5>
                      <p className="text-gray-500">Pencipta: {p.primaryCreatorName}</p>
                    </div>
                    <Badge variant="warning">Perlu Dikemas Kini</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {selectedReport === 'tahunan' && (
        <Card>
          <CardHeader
            title="Laporan E: Laporan Tahunan Inovasi Institusi"
            subtitle={`Ringkasan eksekutif komprehensif bagi Tahun ${selectedYear === 'SEMUA' ? '2026' : selectedYear}`}
          />
          <CardBody className="space-y-4 text-xs text-gray-700">
            <div className="p-4 rounded-xl bg-navy-900 text-white space-y-2">
              <h4 className="text-sm font-bold text-amber-400">POLITEKNIK BANTING SELANGOR</h4>
              <p className="text-xs text-navy-100">
                Laporan rasmi arkib digital inovasi pembelajaran membuktikan komitmen pensyarah dan staf akademik dalam melonjakkan mutu PdP melalui pendekatan berasaskan teknologi terkini.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 border rounded-lg bg-gray-50">
                <span className="text-gray-500 block">Jumlah Pendaftaran</span>
                <span className="text-xl font-bold text-gray-900">{filteredProducts.length}</span>
              </div>
              <div className="p-3 border rounded-lg bg-gray-50">
                <span className="text-gray-500 block">Produk Diluluskan</span>
                <span className="text-xl font-bold text-emerald-700">{approvedCount}</span>
              </div>
              <div className="p-3 border rounded-lg bg-gray-50">
                <span className="text-gray-500 block">Pencapaian Disahkan</span>
                <span className="text-xl font-bold text-amber-700">{verifiedAchievementsCount}</span>
              </div>
              <div className="p-3 border rounded-lg bg-gray-50">
                <span className="text-gray-500 block">Dokumen Dimuat Naik</span>
                <span className="text-xl font-bold text-slate-800">{filteredDocs.length}</span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <Button onClick={handleExportPDF} variant="primary" icon={<FileDown className="w-4 h-4" />}>
                Cetak / Simpan Laporan Tahunan (PDF)
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
