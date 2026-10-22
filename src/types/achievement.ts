export type AchievementCategory =
  | 'Pertandingan Inovasi'
  | 'Anugerah Institusi'
  | 'Pengiktirafan Negeri'
  | 'Pengiktirafan Kebangsaan'
  | 'Pengiktirafan Antarabangsa'
  | 'Penerbitan'
  | 'Penggunaan dalam PdP'
  | 'Impak Pembelajaran'
  | 'Pengiktirafan Lain';

export type RecognitionLevel =
  | 'Institusi'
  | 'Zon / Wilayah'
  | 'Negeri'
  | 'Kebangsaan'
  | 'Antarabangsa';

export type AwardType =
  | 'Emas'
  | 'Perak'
  | 'Gangsa'
  | 'Johan'
  | 'Naib Johan'
  | 'Tempat Ketiga'
  | 'Anugerah Khas'
  | 'Penghargaan'
  | 'Penyertaan'
  | 'Lain-lain';

export type AchievementVerificationStatus =
  | 'Draf'
  | 'Dihantar'
  | 'Dalam Semakan'
  | 'Disahkan'
  | 'Memerlukan Pembetulan'
  | 'Ditolak';

export interface Achievement {
  achievementId: string;
  productId: string;
  productTitle?: string;
  productArchiveCode?: string;
  departmentId?: string;
  
  title: string;
  category: AchievementCategory;
  eventName: string;
  organizer: string;
  recognitionLevel: RecognitionLevel;
  resultType: AwardType;
  achievementDate: string; // YYYY-MM-DD
  achievementYear: number;
  description: string;
  
  // Bukti dan Dokumen
  certificateUrl?: string;
  certificateDocumentId?: string;
  evidenceUrls?: string[];
  referenceUrl?: string; // Link rujukan rasmi
  
  // Aliran Pengesahan
  verificationStatus: AchievementVerificationStatus;
  submittedBy: string; // User UID
  submittedByName?: string;
  verifiedBy?: string; // Admin UID
  verifiedByName?: string;
  verifiedAt?: string;
  administrativeNotes?: string;
  correctionNotes?: string;
  
  createdAt: string;
  updatedAt: string;
}
