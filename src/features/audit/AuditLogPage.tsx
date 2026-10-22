import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { dbService } from '../../services/storage/databaseService';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDateTimeMs } from '../../utils/dateFormatter';
import { AuditLogEntry, AuditAction } from '../../types/audit';

export const AuditLogPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('SEMUA');
  const [viewingLog, setViewingLog] = useState<AuditLogEntry | null>(null);

  const allLogs = useMemo(() => {
    let list = dbService.getAuditLogs();

    if (selectedAction !== 'SEMUA') {
      list = list.filter((l) => l.action === selectedAction);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (l) =>
          l.actorName.toLowerCase().includes(q) ||
          l.details?.toLowerCase().includes(q) ||
          (l.entityIdentifier && l.entityIdentifier.toLowerCase().includes(q))
      );
    }

    return list;
  }, [selectedAction, searchQuery]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <PageHeader
        title="Log Aktiviti & Jejak Audit (Audit Trail)"
        subtitle="Rekod kronologi tidak boleh diubah bagi setiap tindakan rasmi, kelulusan dan pengemaskinian data"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Log Aktiviti' },
        ]}
      />

      {/* Filter Bar */}
      <Card>
        <CardBody className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari mengikut nama pengguna, butiran atau kod arkib..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base pl-9 text-xs py-2"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="input-base text-xs py-1.5 w-auto"
            >
              <option value="SEMUA">Semua Jenis Tindakan</option>
              <option value="LOGIN">LOGIN</option>
              <option value="LOGOUT">LOGOUT</option>
              <option value="PRODUCT_CREATE">PRODUCT_CREATE</option>
              <option value="PRODUCT_SUBMIT">PRODUCT_SUBMIT</option>
              <option value="PRODUCT_APPROVE">PRODUCT_APPROVE</option>
              <option value="PRODUCT_UPDATE">PRODUCT_UPDATE</option>
              <option value="ACHIEVEMENT_CREATE">ACHIEVEMENT_CREATE</option>
              <option value="ACHIEVEMENT_VERIFY">ACHIEVEMENT_VERIFY</option>
              <option value="DOCUMENT_UPLOAD">DOCUMENT_UPLOAD</option>
              <option value="USER_ROLE_CHANGE">USER_ROLE_CHANGE</option>
              <option value="SETTINGS_UPDATE">SETTINGS_UPDATE</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedAction('SEMUA');
              }}
              title="Set Semula"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <Card>
        <CardBody className="p-0">
          {allLogs.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="Tiada Log Aktiviti Ditemui"
                description="Tiada rekod jejak audit yang memenuhi kriteria carian anda."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-navy-800 text-white font-semibold">
                  <tr>
                    <th className="py-3 px-4">Tarikh & Masa</th>
                    <th className="py-3 px-4">Pengguna</th>
                    <th className="py-3 px-4">Peranan</th>
                    <th className="py-3 px-4">Tindakan</th>
                    <th className="py-3 px-4">Entiti / Rujukan</th>
                    <th className="py-3 px-4">Keterangan Transaksi</th>
                    <th className="py-3 px-4 text-center">Hasil</th>
                    <th className="py-3 px-4 text-right">Perincian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allLogs.map((log) => (
                    <tr key={log.auditId} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4 text-gray-500 font-mono whitespace-nowrap">
                        {formatDateTimeMs(log.timestamp)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900 whitespace-nowrap">
                        {log.actorName}
                      </td>
                      <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{log.actorRole}</td>
                      <td className="py-3 px-4 font-mono font-bold text-navy-800 whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-700 whitespace-nowrap">
                        {log.entityIdentifier || log.entityType || '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-600 max-w-sm truncate">{log.details}</td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle className="w-3 h-3" />
                          <span>{log.outcome}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingLog(log)}
                          title="Lihat Perincian"
                        >
                          <Eye className="w-3.5 h-3.5 text-navy-800" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Log Details Modal */}
      {viewingLog && (
        <Modal
          isOpen={Boolean(viewingLog)}
          onClose={() => setViewingLog(null)}
          title="Perincian Jejak Audit Rasmi"
          subtitle={`ID Audit: ${viewingLog.auditId}`}
          footer={<Button onClick={() => setViewingLog(null)}>Tutup</Button>}
        >
          <div className="space-y-3 text-xs text-gray-700">
            <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p><strong>Pengguna:</strong> {viewingLog.actorName}</p>
              <p><strong>Peranan:</strong> {viewingLog.actorRole}</p>
              <p><strong>Tindakan:</strong> {viewingLog.action}</p>
              <p><strong>Entiti:</strong> {viewingLog.entityType}</p>
              <p><strong>Rujukan:</strong> {viewingLog.entityIdentifier || '-'}</p>
              <p><strong>Tarikh:</strong> {formatDateTimeMs(viewingLog.timestamp)}</p>
            </div>

            <div>
              <label className="label-base">Keterangan:</label>
              <p className="p-3 bg-white border border-gray-200 rounded-lg text-gray-800">
                {viewingLog.details}
              </p>
            </div>

            {viewingLog.metadata && (
              <div>
                <label className="label-base">Metadata Transaksi:</label>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-[11px] overflow-x-auto">
                  {JSON.stringify(viewingLog.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
