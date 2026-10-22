export type UserRole = 
  | 'super_admin'       // Super Admin: Kawalan penuh pentadbiran sistem
  | 'pentadbir_uepm'    // Pentadbir UePM: Pengurusan arkib institusi & kelulusan
  | 'pegawai_jabatan'   // Pegawai Jabatan: Kawalan & semakan peringkat jabatan (JKM, JPP, dll.)
  | 'pensyarah'         // Pensyarah / Pencipta Produk: Pendaftaran, draf, pengemaskinian produk
  | 'pengurusan';       // Pengurusan / Pembaca: Paparan sahaja (read-only)

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  staffId?: string;
  role: UserRole;
  departmentId?: string; // e.g., 'JKM', 'JPP', or 'SEMUA'
  active: boolean;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface Department {
  departmentId: string;
  code: string; // e.g. JKM, JPP, JMSK, JPA, JP
  name: string; // e.g. Jabatan Kejuruteraan Mekanikal
  active: boolean;
  createdAt: string;
  updatedAt: string;
  headName?: string;
  contactEmail?: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}
