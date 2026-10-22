export interface AppNotification {
  notificationId: string;
  recipientUid: string; // or 'ALL_ADMINS' or 'ALL_USERS'
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  relatedRecordId?: string;
  relatedRecordType?: 'product' | 'achievement' | 'document' | 'user';
  destinationRoute?: string;
  read: boolean;
  createdAt: string;
}
