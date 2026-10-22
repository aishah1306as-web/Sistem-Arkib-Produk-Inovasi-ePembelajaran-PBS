import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { documentUploadSchema, DocumentUploadFormData } from '../../schemas/documentSchema';
import { dbService } from '../../services/storage/databaseService';
import { useAuth } from '../../contexts/AuthContext';
import { validateUploadedFile, formatFileSize } from '../../utils/fileValidator';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  productTitle?: string;
  onSuccess: () => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  productId: defaultProductId,
  productTitle: defaultProductTitle,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const settings = dbService.getSystemSettings();
  const allowedExtensions = settings.allowedFileTypes || ['.pdf', '.docx', '.xlsx', '.pptx', '.jpg', '.png'];
  const maxFileSizeMB = settings.maxFileSizeMB || 25;
  const availableProducts = dbService.getProducts();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DocumentUploadFormData>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      productId: defaultProductId || '',
      title: '',
      category: 'Pembangunan Produk',
      description: '',
      reportingYear: new Date().getFullYear(),
      accessClassification: 'Dalaman',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const result = validateUploadedFile(file, maxFileSizeMB, allowedExtensions);
      if (!result.valid) {
        setValidationError(result.error || 'Fail tidak sah.');
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
      }
    }
  };

  const onSubmit = async (data: DocumentUploadFormData) => {
    if (!user) return;
    if (!selectedFile) {
      setValidationError('Sila pilih fail untuk dimuat naik.');
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);

    try {
      dbService.uploadDocument(
        {
          ...data,
          productId: data.productId || defaultProductId || '',
          accessClassification: data.accessClassification as any,
          category: data.category as any,
          verificationStatus: 'Disahkan',
          uploadedBy: user.uid,
          uploadedByName: user.fullName,
        },
        selectedFile,
        user
      );

      reset();
      setSelectedFile(null);
      onSuccess();
      onClose();
    } catch (err: any) {
      setValidationError(err.message || 'Ralat semasa memuat naik dokumen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Muat Naik Dokumen Arkib"
      subtitle={defaultProductTitle ? `Produk: ${defaultProductTitle}` : 'Tambah fail laporan atau manual ke dalam arkib'}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {validationError && <Alert type="danger">{validationError}</Alert>}

        {!defaultProductId && (
          <div>
            <label className="label-base">
              Produk Berkaitan <span className="text-rose-500">*</span>
            </label>
            <select className="input-base" {...register('productId')}>
              <option value="">-- Pilih Produk Inovasi --</option>
              {availableProducts.map((p) => (
                <option key={p.productId} value={p.productId}>
                  {p.archiveCode} - {p.title}
                </option>
              ))}
            </select>
            {errors.productId && <p className="text-xs text-rose-600 mt-1">{errors.productId.message}</p>}
          </div>
        )}

        <div>
          <label className="label-base">
            Tajuk Dokumen <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Kertas Cadangan & Manual Pengguna Modul AR"
            className="input-base"
            {...register('title')}
          />
          {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="label-base">
              Kategori Dokumen <span className="text-rose-500">*</span>
            </label>
            <select className="input-base" {...register('category')}>
              <option value="Pendaftaran">Pendaftaran</option>
              <option value="Pembangunan Produk">Pembangunan Produk</option>
              <option value="Laporan Penggunaan">Laporan Penggunaan</option>
              <option value="Laporan Tahunan">Laporan Tahunan</option>
              <option value="Pencapaian dan Sijil">Pencapaian dan Sijil</option>
              <option value="Penilaian dan Impak">Penilaian dan Impak</option>
              <option value="Dokumentasi Media">Dokumentasi Media</option>
              <option value="Manual Pengguna">Manual Pengguna</option>
              <option value="Dokumen Pentadbiran">Dokumen Pentadbiran</option>
              <option value="Lain-lain">Lain-lain</option>
            </select>
          </div>

          <div>
            <label className="label-base">
              Klasifikasi Akses <span className="text-rose-500">*</span>
            </label>
            <select className="input-base" {...register('accessClassification')}>
              <option value="Awam">Awam (Boleh diakses semua)</option>
              <option value="Dalaman">Dalaman (Staf PBS sahaja)</option>
              <option value="Terhad">Terhad (Jabatan sahaja)</option>
              <option value="Sulit">Sulit (Pemilik & Pentadbir)</option>
            </select>
          </div>

          <div>
            <label className="label-base">Tahun Laporan</label>
            <input
              type="number"
              className="input-base"
              {...register('reportingYear', { valueAsNumber: true })}
            />
          </div>
        </div>

        {/* File Dropzone */}
        <div>
          <label className="label-base">
            Fail Dokumen <span className="text-rose-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-navy-500 transition-colors bg-gray-50/50">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <div className="text-xs text-gray-600">
              <label className="font-semibold text-navy-800 hover:text-navy-900 cursor-pointer underline">
                <span>Pilih fail dari komputer</span>
                <input
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept={allowedExtensions.join(',')}
                />
              </label>
              <p className="text-[11px] text-gray-500 mt-1">
                Format dibenarkan: {allowedExtensions.join(', ')} (Maksimum {maxFileSizeMB} MB)
              </p>
            </div>
            {selectedFile && (
              <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                <span>
                  <strong>{selectedFile.name}</strong> ({formatFileSize(selectedFile.size)})
                </span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="label-base">Penerangan / Catatan Dokumen (Pilihan)</label>
          <textarea
            rows={2}
            placeholder="Catatan mengenai kandungan fail..."
            className="input-base"
            {...register('description')}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" loading={isSubmitting} icon={<Upload className="w-4 h-4" />}>
            Muat Naik Dokumen
          </Button>
        </div>
      </form>
    </Modal>
  );
};
