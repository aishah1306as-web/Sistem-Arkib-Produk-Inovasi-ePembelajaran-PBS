import { z } from 'zod';

export const userManagementSchema = z.object({
  fullName: z.string().min(3, { message: 'Nama penuh sekurang-kurangnya 3 aksara' }),
  email: z.string().email({ message: 'Alamat e-mel tidak sah' }),
  staffId: z.string().optional().or(z.literal('')),
  role: z.enum(['super_admin', 'pentadbir_uepm', 'pegawai_jabatan', 'pensyarah', 'pengurusan']),
  departmentId: z.string().optional().or(z.literal('')),
  active: z.boolean().default(true),
  password: z.string().min(6, { message: 'Kata laluan sekurang-kurangnya 6 aksara' }).optional().or(z.literal('')),
});

export type UserManagementFormData = z.infer<typeof userManagementSchema>;
