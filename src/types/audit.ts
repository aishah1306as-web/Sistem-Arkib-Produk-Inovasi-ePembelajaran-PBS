export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'PRODUCT_CREATE'
  | 'PRODUCT_UPDATE'
  | 'PRODUCT_SUBMIT'
  | 'PRODUCT_APPROVE'
  | 'PRODUCT_REJECT'
  | 'PRODUCT_CORRECTION'
  | 'ACHIEVEMENT_CREATE'
  | 'ACHIEVEMENT_VERIFY'
  | 'ACHIEVEMENT_REJECT'
  | 'DOCUMENT_UPLOAD'
  | 'DOCUMENT_VERSION_ADD'
  | 'DOCUMENT_DELETE'
  | 'USER_CREATE'
  | 'USER_ROLE_CHANGE'
  | 'USER_STATUS_CHANGE'
  | 'SETTINGS_UPDATE'
  | 'REPORT_GENERATE'
  | 'REPORT_EXPORT';

export interface AuditLogEntry {
  auditId: string;
  actorUid: string;
  actorName: string;
  actorRole: string;
  action: AuditAction;
  entityType: 'Product' | 'Achievement' | 'Document' | 'User' | 'Settings' | 'Report' | 'Auth';
  entityId?: string;
  entityIdentifier?: string; // e.g. archive code or user email
  timestamp: string; // ISO string
  metadata?: Record<string, any>;
  ipAddress?: string;
  outcome: 'Berjaya' | 'Gagal';
  details?: string;
}
