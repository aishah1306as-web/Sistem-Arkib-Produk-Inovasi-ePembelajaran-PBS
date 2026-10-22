export type DocumentCategory =
  | 'Pendaftaran'
  | 'Pembangunan Produk'
  | 'Laporan Penggunaan'
  | 'Laporan Tahunan'
  | 'Pencapaian dan Sijil'
  | 'Penilaian dan Impak'
  | 'Dokumentasi Media'
  | 'Manual Pengguna'
  | 'Dokumen Pentadbiran'
  | 'Lain-lain';

export type AccessClassification = 'Awam' | 'Dalaman' | 'Terhad' | 'Sulit';

export interface DocumentVersion {
  versionId: string;
  documentId: string;
  versionNumber: number;
  storagePath: string;
  fileUrl: string;
  originalFilename: string;
  fileSize: number;
  uploadedBy: string;
  uploadedByName: string;
  changeNotes?: string;
  createdAt: string;
}

export interface ArchiveDocument {
  documentId: string;
  productId: string;
  productTitle?: string;
  productArchiveCode?: string;
  achievementId?: string;
  departmentId?: string;
  
  title: string;
  originalFilename: string;
  category: DocumentCategory;
  description?: string;
  reportingYear: number;
  storagePath: string;
  fileUrl: string; // URL for download/preview
  mimeType: string;
  fileSize: number; // in bytes
  version: number;
  accessClassification: AccessClassification;
  verificationStatus: 'Disahkan' | 'Dalam Semakan' | 'Tidak Sah';
  
  uploadedBy: string;
  uploadedByName: string;
  createdAt: string;
  updatedAt: string;
  
  versions?: DocumentVersion[];
}
