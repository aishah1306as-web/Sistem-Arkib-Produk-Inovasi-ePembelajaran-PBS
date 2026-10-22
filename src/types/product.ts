export type RegistrationStatus = 
  | 'Draf'                     // Draf belum dihantar
  | 'Dihantar untuk Semakan'   // Baru dihantar oleh pencipta
  | 'Dalam Semakan'            // Sedang disemak oleh UePM/Pegawai
  | 'Memerlukan Pembetulan'    // Perlu pembetulan sebelum semakan semula
  | 'Diluluskan'               // Diluluskan rasmi ke dalam arkib
  | 'Ditolak'                  // Ditolak dengan alasan rasmi
  | 'Diarkibkan';              // Status arkib kekal

export type DevelopmentStatus =
  | 'Perancangan'
  | 'Dalam Pembangunan'
  | 'Pengujian & Penilaian'
  | 'Sedia Digunakan'
  | 'Selesai & Diarkibkan';

export interface ProductCategory {
  categoryId: string;
  name: string;
  description?: string;
  active: boolean;
  sortOrder: number;
}

export interface ProductMember {
  membershipId: string;
  productId: string;
  userId?: string;
  displayName: string;
  roleInProject: string; // e.g. Ketua Projek, Pereka Instruksional, Pengaturcara, Penilai Kandungan
  email?: string;
  staffId?: string;
  institution?: string;
  contributionDescription?: string;
  createdAt: string;
}

export interface ProductStatusHistory {
  historyId: string;
  productId: string;
  previousStatus: RegistrationStatus;
  newStatus: RegistrationStatus;
  changedBy: string; // User UID
  changedByName: string;
  changedByRole: string;
  reason?: string;
  changedAt: string;
}

export interface InnovationProduct {
  productId: string;
  archiveCode: string; // e.g. PBS-EP-2026-0001
  title: string;
  normalizedTitle: string; // for duplicate checks and case-insensitive search
  summary: string;
  description: string;
  objectives: string;
  problemStatement: string;
  thumbnailUrl?: string;
  thumbnailDocumentId?: string;
  
  // Maklumat Akademik
  departmentId: string; // JKM, JPP, dll.
  departmentName?: string;
  program: string;
  courseCode?: string;
  courseName: string;
  semester?: string;
  targetAudience: string;
  pedagogicalMethod: string; // Kaedah penggunaan dalam PdP
  
  // Kategori & Teknologi
  categoryId: string;
  categoryName?: string;
  tags: string[];
  technologies: string[]; // Canva, H5P, CIDOS, dll.
  
  // Maklumat Pencipta Utama & Pasukan
  primaryCreatorUid: string;
  primaryCreatorName: string;
  primaryCreatorEmail: string;
  primaryCreatorStaffId?: string;
  teamMembers: ProductMember[];
  
  // Maklumat Pembangunan
  developmentYear: number;
  registrationYear: number;
  startDate?: string;
  completionDate?: string;
  developmentStatus: DevelopmentStatus;
  version: string;
  productUrl?: string; // Pautan produk digital
  demoUrl?: string;    // Pautan demo/repositori
  implementationNotes?: string;
  
  // Status Aliran Kerja
  registrationStatus: RegistrationStatus;
  rejectionReason?: string;
  correctionNotes?: string;
  
  // Metadata Audit & Pengesanan
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  approvedByName?: string;
  archivedAt?: string;
  archivedBy?: string;
  
  // Metrik Terkira (Computed / Cached)
  achievementsCount?: number;
  documentsCount?: number;
}
