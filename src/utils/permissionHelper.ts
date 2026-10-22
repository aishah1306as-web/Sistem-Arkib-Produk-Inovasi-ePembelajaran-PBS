import { UserProfile, UserRole } from '../types/auth';
import { InnovationProduct } from '../types/product';
import { Achievement } from '../types/achievement';
import { ArchiveDocument } from '../types/document';

export function canManageUsers(user: UserProfile | null): boolean {
  if (!user || !user.active) return false;
  return user.role === 'super_admin';
}

export function canManageSystemSettings(user: UserProfile | null): boolean {
  if (!user || !user.active) return false;
  return user.role === 'super_admin';
}

export function canViewAuditLogs(user: UserProfile | null): boolean {
  if (!user || !user.active) return false;
  return user.role === 'super_admin' || user.role === 'pentadbir_uepm';
}

export function canRegisterProduct(user: UserProfile | null): boolean {
  if (!user || !user.active) return false;
  return user.role !== 'pengurusan';
}

export function canApproveProduct(user: UserProfile | null): boolean {
  if (!user || !user.active) return false;
  return user.role === 'super_admin' || user.role === 'pentadbir_uepm';
}

export function canReviewDepartmentProduct(user: UserProfile | null, productDeptId?: string): boolean {
  if (!user || !user.active) return false;
  if (user.role === 'super_admin' || user.role === 'pentadbir_uepm') return true;
  if (user.role === 'pegawai_jabatan') {
    return !user.departmentId || user.departmentId === 'SEMUA' || user.departmentId === productDeptId;
  }
  return false;
}

export function canEditProduct(user: UserProfile | null, product: InnovationProduct): boolean {
  if (!user || !user.active) return false;
  if (user.role === 'super_admin') return true;
  if (user.role === 'pentadbir_uepm' && product.registrationStatus !== 'Diluluskan') return true;

  // The creator can edit if it's in Draft or Returned for Correction
  const isCreator = product.primaryCreatorUid === user.uid || product.createdBy === user.uid;
  const isEditableStatus = product.registrationStatus === 'Draf' || product.registrationStatus === 'Memerlukan Pembetulan';
  return isCreator && isEditableStatus;
}

export function canDeleteProduct(user: UserProfile | null, product: InnovationProduct): boolean {
  if (!user || !user.active) return false;
  // An approved product CANNOT be permanently deleted through standard user workflow!
  if (product.registrationStatus === 'Diluluskan') return false;
  if (user.role === 'super_admin') return true;
  return (product.primaryCreatorUid === user.uid) && product.registrationStatus === 'Draf';
}

export function canSubmitAchievement(user: UserProfile | null, product: InnovationProduct): boolean {
  if (!user || !user.active) return false;
  if (user.role === 'pengurusan') return false;
  if (user.role === 'super_admin' || user.role === 'pentadbir_uepm') return true;
  return product.primaryCreatorUid === user.uid || product.teamMembers.some(m => m.userId === user.uid);
}

export function canVerifyAchievement(user: UserProfile | null): boolean {
  if (!user || !user.active) return false;
  return user.role === 'super_admin' || user.role === 'pentadbir_uepm';
}

export function canUploadDocument(user: UserProfile | null, product: InnovationProduct): boolean {
  if (!user || !user.active) return false;
  if (user.role === 'pengurusan') return false;
  if (user.role === 'super_admin' || user.role === 'pentadbir_uepm') return true;
  if (user.role === 'pegawai_jabatan') {
    return !user.departmentId || user.departmentId === 'SEMUA' || user.departmentId === product.departmentId;
  }
  return product.primaryCreatorUid === user.uid || product.teamMembers.some(m => m.userId === user.uid);
}

export function canViewDocument(user: UserProfile | null, doc: ArchiveDocument): boolean {
  if (!user || !user.active) return false;
  if (user.role === 'super_admin' || user.role === 'pentadbir_uepm') return true;
  if (doc.accessClassification === 'Awam' || doc.accessClassification === 'Dalaman') return true;
  
  if (doc.accessClassification === 'Terhad') {
    if (user.role === 'pegawai_jabatan') {
      return !user.departmentId || user.departmentId === 'SEMUA' || user.departmentId === doc.departmentId;
    }
    return doc.uploadedBy === user.uid;
  }

  // Sulit: Only uploader or super admin
  return doc.uploadedBy === user.uid || user.role === 'super_admin';
}

export function canExportReports(user: UserProfile | null): boolean {
  if (!user || !user.active) return false;
  return true; // All authenticated institutional roles can export their authorized data
}

export function getRoleNameMalay(role: UserRole): string {
  switch (role) {
    case 'super_admin':
      return 'Super Admin';
    case 'pentadbir_uepm':
      return 'Pentadbir UePM';
    case 'pegawai_jabatan':
      return 'Pegawai Jabatan';
    case 'pensyarah':
      return 'Pensyarah / Pencipta';
    case 'pengurusan':
      return 'Pengurusan / Pembaca';
    default:
      return role;
  }
}
