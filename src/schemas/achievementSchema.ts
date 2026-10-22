import { z } from 'zod';

export const achievementFormSchema = z.object({
  productId: z.string().min(1, { message: 'Sila pilih produk inovasi yang berkaitan' }),
  title: z.string().min(3, { message: 'Tajuk pencapaian sekurang-kurangnya 3 aksara' }),
  category: z.enum([
    'Pertandingan Inovasi',
    'Anugerah Institusi',
    'Pengiktirafan Negeri',
    'Pengiktirafan Kebangsaan',
    'Pengiktirafan Antarabangsa',
    'Penerbitan',
    'Penggunaan dalam PdP',
    'Impak Pembelajaran',
    'Pengiktirafan Lain',
  ]),
  eventName: z.string().min(2, { message: 'Sila nyatakan nama pertandingan, program atau peristiwa' }),
  organizer: z.string().min(2, { message: 'Sila nyatakan pihak penganjur' }),
  recognitionLevel: z.enum([
    'Institusi',
    'Zon / Wilayah',
    'Negeri',
    'Kebangsaan',
    'Antarabangsa',
  ]),
  resultType: z.enum([
    'Emas',
    'Perak',
    'Gangsa',
    'Johan',
    'Naib Johan',
    'Tempat Ketiga',
    'Anugerah Khas',
    'Penghargaan',
    'Penyertaan',
    'Lain-lain',
  ]),
  achievementDate: z.string().min(4, { message: 'Tarikh pencapaian diperlukan' }),
  achievementYear: z.number().int().min(2010).max(2035),
  description: z.string().min(10, { message: 'Penerangan pencapaian sekurang-kurangnya 10 aksara' }),
  certificateUrl: z.string().optional().or(z.literal('')),
  referenceUrl: z.string().url({ message: 'Pautan rujukan mestilah format URL yang sah' }).optional().or(z.literal('')),
});

export type AchievementFormData = z.infer<typeof achievementFormSchema>;
