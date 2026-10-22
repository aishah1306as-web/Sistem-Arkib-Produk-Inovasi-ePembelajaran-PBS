export type ReportType =
  | 'laporan_keseluruhan_produk'
  | 'laporan_pencapaian'
  | 'laporan_penggunaan_impak'
  | 'laporan_kelengkapan_arkib'
  | 'laporan_tahunan_institusi';

export interface ReportFilterOptions {
  year?: number;
  departmentId?: string;
  categoryId?: string;
  status?: string;
  recognitionLevel?: string;
  startDate?: string;
  endDate?: string;
}

export interface GeneratedReport {
  reportId: string;
  title: string;
  reportType: ReportType;
  reportingYear: number;
  departmentId?: string;
  filters: ReportFilterOptions;
  generatedBy: string;
  generatedByName: string;
  generatedAt: string;
  summaryData: Record<string, any>;
  status: 'Selesai' | 'Dalam Proses' | 'Gagal';
  downloadUrl?: string;
}
