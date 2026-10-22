import { z } from 'zod';

export const documentUploadSchema = z.object({
  productId: z.string().min(1, { message: 'Produk berkaitan mesti dipilih' }),
  title: z.string().min(3, { message: 'Tajuk dokumen sekurang-kurangnya 3 aksara' }),
  category: z.enum([
    'Pendaftaran',
    'Pembangunan Produk',
    'Laporan Penggunaan',
    'Laporan Tahunan',
    'Pencapaian dan Sijil',
    'Penilaian dan Impak',
    'Dokumentasi Media',
    'Manual Pengguna',
    'Dokumen Pentadbiran',
    'Lain-lain',
  ]),
  description: z.string().optional().or(z.literal('')),
  reportingYear: z.number().int().min(2010).max(2035),
  accessClassification: z.enum(['Awam', 'Dalaman', 'Terhad', 'Sulit']),
});

export type DocumentUploadFormData = z.infer<typeof documentUploadSchema>;
