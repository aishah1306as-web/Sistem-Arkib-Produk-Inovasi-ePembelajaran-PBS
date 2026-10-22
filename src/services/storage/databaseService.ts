import { InnovationProduct, RegistrationStatus, ProductStatusHistory } from '../../types/product';
import { Achievement, AchievementVerificationStatus } from '../../types/achievement';
import { ArchiveDocument, DocumentVersion } from '../../types/document';
import { UserProfile } from '../../types/auth';
import { SystemSettings } from '../../types/settings';
import { AuditLogEntry, AuditAction } from '../../types/audit';
import { AppNotification } from '../../types/notification';
import { INITIAL_DEPARTMENTS, INITIAL_CATEGORIES, INITIAL_SYSTEM_SETTINGS, INITIAL_USERS } from './initialData';
import { formatArchiveCode } from '../../utils/archiveCode';

const STORAGE_KEYS = {
  PRODUCTS: 'sapie_products_v1',
  ACHIEVEMENTS: 'sapie_achievements_v1',
  DOCUMENTS: 'sapie_documents_v1',
  USERS: 'sapie_users_v1',
  SETTINGS: 'sapie_settings_v1',
  AUDIT: 'sapie_audit_logs_v1',
  NOTIFICATIONS: 'sapie_notifications_v1',
  COUNTERS: 'sapie_counters_v1',
};

// Helper: Read from LocalStorage with fallback
function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

// Helper: Save to LocalStorage
function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

export class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {
    this.ensureInitialized();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Ensure initial base configurations exist
  private ensureInitialized(): void {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      setLocalItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      setLocalItem(STORAGE_KEYS.SETTINGS, INITIAL_SYSTEM_SETTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      setLocalItem(STORAGE_KEYS.PRODUCTS, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS)) {
      setLocalItem(STORAGE_KEYS.ACHIEVEMENTS, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
      setLocalItem(STORAGE_KEYS.DOCUMENTS, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT)) {
      setLocalItem(STORAGE_KEYS.AUDIT, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      setLocalItem(STORAGE_KEYS.NOTIFICATIONS, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.COUNTERS)) {
      setLocalItem(STORAGE_KEYS.COUNTERS, { 2026: 0 });
    }
  }

  // ==========================================
  // ARCHIVE CODE GENERATOR (Concurrency-Safe)
  // ==========================================
  public generateNextArchiveCode(year: number = new Date().getFullYear()): string {
    const counters = getLocalItem<Record<string, number>>(STORAGE_KEYS.COUNTERS, {});
    const currentYearCount = (counters[year] || 0) + 1;
    counters[year] = currentYearCount;
    setLocalItem(STORAGE_KEYS.COUNTERS, counters);

    const settings = this.getSystemSettings();
    const prefix = settings.archiveCodePrefix || 'PBS-EP';
    return formatArchiveCode(prefix, year, currentYearCount);
  }

  // Check potential duplicate products
  public checkPotentialDuplicate(title: string, excludeProductId?: string): InnovationProduct | null {
    const products = this.getProducts();
    const normalized = title.trim().toLowerCase();
    return products.find(p => 
      p.normalizedTitle === normalized && p.productId !== excludeProductId
    ) || null;
  }

  // ==========================================
  // PRODUCTS
  // ==========================================
  public getProducts(filters?: {
    status?: RegistrationStatus | 'SEMUA';
    departmentId?: string;
    categoryId?: string;
    year?: number;
    searchQuery?: string;
    creatorUid?: string;
  }): InnovationProduct[] {
    let products = getLocalItem<InnovationProduct[]>(STORAGE_KEYS.PRODUCTS, []);

    if (!filters) return products;

    if (filters.status && filters.status !== 'SEMUA') {
      products = products.filter(p => p.registrationStatus === filters.status);
    }
    if (filters.departmentId && filters.departmentId !== 'SEMUA') {
      products = products.filter(p => p.departmentId === filters.departmentId);
    }
    if (filters.categoryId && filters.categoryId !== 'SEMUA') {
      products = products.filter(p => p.categoryId === filters.categoryId);
    }
    if (filters.year) {
      products = products.filter(p => p.registrationYear === filters.year || p.developmentYear === filters.year);
    }
    if (filters.creatorUid) {
      products = products.filter(p => 
        p.primaryCreatorUid === filters.creatorUid || 
        p.createdBy === filters.creatorUid ||
        p.teamMembers.some(m => m.userId === filters.creatorUid)
      );
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      products = products.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.archiveCode.toLowerCase().includes(q) ||
        p.primaryCreatorName.toLowerCase().includes(q) ||
        p.courseName.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        (p.departmentName && p.departmentName.toLowerCase().includes(q))
      );
    }

    return products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getProductById(productId: string): InnovationProduct | null {
    const products = this.getProducts();
    return products.find(p => p.productId === productId) || null;
  }

  public createProduct(
    productData: Omit<InnovationProduct, 'productId' | 'archiveCode' | 'normalizedTitle' | 'createdAt' | 'updatedAt'>,
    actor: UserProfile,
    isDraft: boolean = false
  ): InnovationProduct {
    const products = this.getProducts();
    const productId = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const regYear = productData.registrationYear || new Date().getFullYear();
    const archiveCode = this.generateNextArchiveCode(regYear);

    const department = INITIAL_DEPARTMENTS.find(d => d.departmentId === productData.departmentId);
    const category = INITIAL_CATEGORIES.find(c => c.categoryId === productData.categoryId);

    const initialStatus: RegistrationStatus = isDraft ? 'Draf' : 'Dihantar untuk Semakan';

    const newProduct: InnovationProduct = {
      ...productData,
      productId,
      archiveCode,
      normalizedTitle: productData.title.trim().toLowerCase(),
      departmentName: department?.name || productData.departmentId,
      categoryName: category?.name || productData.categoryId,
      registrationStatus: initialStatus,
      submittedAt: isDraft ? undefined : new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      achievementsCount: 0,
      documentsCount: 0,
    };

    products.unshift(newProduct);
    setLocalItem(STORAGE_KEYS.PRODUCTS, products);

    // Audit Log
    this.createAuditLog({
      actorUid: actor.uid,
      actorName: actor.fullName,
      actorRole: actor.role,
      action: isDraft ? 'PRODUCT_CREATE' : 'PRODUCT_SUBMIT',
      entityType: 'Product',
      entityId: productId,
      entityIdentifier: archiveCode,
      outcome: 'Berjaya',
      details: isDraft ? `Menyimpan draf produk inovasi: ${newProduct.title}` : `Menghantar pendaftaran produk untuk semakan: ${newProduct.title} (${archiveCode})`,
    });

    // Notification for Admins if submitted
    if (!isDraft) {
      this.createNotification({
        title: 'Pendaftaran Produk Baharu Diterima',
        message: `Produk "${newProduct.title}" (${archiveCode}) telah dihantar oleh ${actor.fullName} untuk semakan institusi.`,
        recipientUid: 'ALL_ADMINS',
        type: 'info',
        relatedRecordId: productId,
        relatedRecordType: 'product',
        destinationRoute: `/arkib-produk/${productId}`,
      });
    }

    return newProduct;
  }

  public updateProduct(
    productId: string,
    updates: Partial<InnovationProduct>,
    actor: UserProfile,
    actionReason?: string
  ): InnovationProduct {
    const products = this.getProducts();
    const index = products.findIndex(p => p.productId === productId);
    if (index === -1) throw new Error('Produk tidak dijumpai');

    const existing = products[index];
    const previousStatus = existing.registrationStatus;

    // Check status transition
    const isStatusChange = updates.registrationStatus && updates.registrationStatus !== previousStatus;

    const updated: InnovationProduct = {
      ...existing,
      ...updates,
      normalizedTitle: updates.title ? updates.title.trim().toLowerCase() : existing.normalizedTitle,
      updatedAt: new Date().toISOString(),
    };

    products[index] = updated;
    setLocalItem(STORAGE_KEYS.PRODUCTS, products);

    // Audit log
    this.createAuditLog({
      actorUid: actor.uid,
      actorName: actor.fullName,
      actorRole: actor.role,
      action: isStatusChange ? 'PRODUCT_UPDATE' : 'PRODUCT_UPDATE',
      entityType: 'Product',
      entityId: productId,
      entityIdentifier: existing.archiveCode,
      outcome: 'Berjaya',
      details: actionReason || `Mengemas kini maklumat produk ${existing.archiveCode} (${existing.title})`,
      metadata: { previousStatus, newStatus: updated.registrationStatus },
    });

    return updated;
  }

  // Workflow: Approve Product
  public approveProduct(productId: string, actor: UserProfile, notes?: string): InnovationProduct {
    const product = this.getProductById(productId);
    if (!product) throw new Error('Produk tidak dijumpai');

    const updated = this.updateProduct(productId, {
      registrationStatus: 'Diluluskan',
      approvedAt: new Date().toISOString(),
      approvedBy: actor.uid,
      approvedByName: actor.fullName,
      rejectionReason: undefined,
      correctionNotes: undefined,
    }, actor, `Meluluskan produk pendaftaran ${product.archiveCode} ke dalam arkib rasmi.`);

    // Notify creator
    this.createNotification({
      title: 'Pendaftaran Produk Diluluskan!',
      message: `Tahniah! Produk inovasi "${product.title}" (${product.archiveCode}) telah diluluskan dan kini rasmi diarkibkan.`,
      recipientUid: product.primaryCreatorUid,
      type: 'success',
      relatedRecordId: productId,
      relatedRecordType: 'product',
      destinationRoute: `/arkib-produk/${productId}`,
    });

    return updated;
  }

  // Workflow: Return Product for Correction
  public returnForCorrection(productId: string, correctionNotes: string, actor: UserProfile): InnovationProduct {
    const product = this.getProductById(productId);
    if (!product) throw new Error('Produk tidak dijumpai');

    const updated = this.updateProduct(productId, {
      registrationStatus: 'Memerlukan Pembetulan',
      correctionNotes,
    }, actor, `Memulangkan pendaftaran ${product.archiveCode} untuk pembetulan: ${correctionNotes}`);

    // Notify creator
    this.createNotification({
      title: 'Pembetulan Diperlukan untuk Produk',
      message: `Pendaftaran produk "${product.title}" memerlukan pembetulan oleh pihak pentadbir: "${correctionNotes}".`,
      recipientUid: product.primaryCreatorUid,
      type: 'warning',
      relatedRecordId: productId,
      relatedRecordType: 'product',
      destinationRoute: `/pendaftaran-produk/${productId}/edit`,
    });

    return updated;
  }

  // Workflow: Reject Product
  public rejectProduct(productId: string, rejectionReason: string, actor: UserProfile): InnovationProduct {
    const product = this.getProductById(productId);
    if (!product) throw new Error('Produk tidak dijumpai');

    const updated = this.updateProduct(productId, {
      registrationStatus: 'Ditolak',
      rejectionReason,
    }, actor, `Menolak pendaftaran ${product.archiveCode}. Sebab: ${rejectionReason}`);

    // Notify creator
    this.createNotification({
      title: 'Pendaftaran Produk Ditolak',
      message: `Dukacita dimaklumkan bahawa pendaftaran produk "${product.title}" telah ditolak. Sebab: ${rejectionReason}`,
      recipientUid: product.primaryCreatorUid,
      type: 'danger',
      relatedRecordId: productId,
      relatedRecordType: 'product',
      destinationRoute: `/arkib-produk/${productId}`,
    });

    return updated;
  }

  // Delete product (Drafts only, permanent deletion of approved records forbidden)
  public deleteDraftProduct(productId: string, actor: UserProfile): boolean {
    const product = this.getProductById(productId);
    if (!product) return false;
    if (product.registrationStatus === 'Diluluskan') {
      throw new Error('Produk yang telah diluluskan tidak boleh dipadamkan secara kekal dari arkib.');
    }

    let products = this.getProducts();
    products = products.filter(p => p.productId !== productId);
    setLocalItem(STORAGE_KEYS.PRODUCTS, products);

    this.createAuditLog({
      actorUid: actor.uid,
      actorName: actor.fullName,
      actorRole: actor.role,
      action: 'PRODUCT_UPDATE',
      entityType: 'Product',
      entityId: productId,
      entityIdentifier: product.archiveCode,
      outcome: 'Berjaya',
      details: `Memadam draf produk inovasi: ${product.title} (${product.archiveCode})`,
    });

    return true;
  }

  // ==========================================
  // ACHIEVEMENTS & RECOGNITION
  // ==========================================
  public getAchievements(filters?: {
    productId?: string;
    status?: AchievementVerificationStatus | 'SEMUA';
    year?: number;
    recognitionLevel?: string;
    departmentId?: string;
  }): Achievement[] {
    let achievements = getLocalItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, []);

    if (!filters) return achievements;

    if (filters.productId) {
      achievements = achievements.filter(a => a.productId === filters.productId);
    }
    if (filters.status && filters.status !== 'SEMUA') {
      achievements = achievements.filter(a => a.verificationStatus === filters.status);
    }
    if (filters.year) {
      achievements = achievements.filter(a => a.achievementYear === filters.year);
    }
    if (filters.recognitionLevel && filters.recognitionLevel !== 'SEMUA') {
      achievements = achievements.filter(a => a.recognitionLevel === filters.recognitionLevel);
    }
    if (filters.departmentId && filters.departmentId !== 'SEMUA') {
      achievements = achievements.filter(a => a.departmentId === filters.departmentId);
    }

    return achievements.sort((a, b) => new Date(b.achievementDate).getTime() - new Date(a.achievementDate).getTime());
  }

  public createAchievement(
    achievementData: Omit<Achievement, 'achievementId' | 'createdAt' | 'updatedAt' | 'verificationStatus'>,
    actor: UserProfile
  ): Achievement {
    const product = this.getProductById(achievementData.productId);
    const achievements = this.getAchievements();
    const achievementId = `ach-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newAchievement: Achievement = {
      ...achievementData,
      achievementId,
      productTitle: product?.title || achievementData.productTitle,
      productArchiveCode: product?.archiveCode || achievementData.productArchiveCode,
      departmentId: product?.departmentId || achievementData.departmentId,
      verificationStatus: 'Dalam Semakan',
      submittedBy: actor.uid,
      submittedByName: actor.fullName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    achievements.unshift(newAchievement);
    setLocalItem(STORAGE_KEYS.ACHIEVEMENTS, achievements);

    // Update product achievement count
    if (product) {
      this.refreshProductCounts(product.productId);
    }

    this.createAuditLog({
      actorUid: actor.uid,
      actorName: actor.fullName,
      actorRole: actor.role,
      action: 'ACHIEVEMENT_CREATE',
      entityType: 'Achievement',
      entityId: achievementId,
      outcome: 'Berjaya',
      details: `Menghantar rekod pencapaian "${newAchievement.title}" (${newAchievement.resultType}) untuk produk ${product?.archiveCode || achievementData.productId}`,
    });

    this.createNotification({
      title: 'Pencapaian Baharu Dihantar',
      message: `Pencapaian "${newAchievement.title}" untuk produk ${product?.archiveCode} telah dihantar oleh ${actor.fullName} untuk pengesahan.`,
      recipientUid: 'ALL_ADMINS',
      type: 'info',
      relatedRecordId: achievementId,
      relatedRecordType: 'achievement',
      destinationRoute: `/pencapaian`,
    });

    return newAchievement;
  }

  public verifyAchievement(
    achievementId: string,
    status: 'Disahkan' | 'Memerlukan Pembetulan' | 'Ditolak',
    notes: string | undefined,
    actor: UserProfile
  ): Achievement {
    const achievements = this.getAchievements();
    const index = achievements.findIndex(a => a.achievementId === achievementId);
    if (index === -1) throw new Error('Rekod pencapaian tidak dijumpai');

    const existing = achievements[index];
    const updated: Achievement = {
      ...existing,
      verificationStatus: status,
      verifiedBy: actor.uid,
      verifiedByName: actor.fullName,
      verifiedAt: new Date().toISOString(),
      administrativeNotes: notes,
      updatedAt: new Date().toISOString(),
    };

    achievements[index] = updated;
    setLocalItem(STORAGE_KEYS.ACHIEVEMENTS, achievements);

    // Refresh count on product
    this.refreshProductCounts(existing.productId);

    this.createAuditLog({
      actorUid: actor.uid,
      actorName: actor.fullName,
      actorRole: actor.role,
      action: status === 'Disahkan' ? 'ACHIEVEMENT_VERIFY' : 'ACHIEVEMENT_REJECT',
      entityType: 'Achievement',
      entityId: achievementId,
      outcome: 'Berjaya',
      details: `${status === 'Disahkan' ? 'Mengesahkan' : 'Mengemas kini'} pencapaian "${existing.title}": Status ${status}`,
    });

    // Notify submitter
    this.createNotification({
      title: `Status Pencapaian: ${status}`,
      message: `Rekod pencapaian "${existing.title}" telah dikemas kini statusnya kepada "${status}" oleh pihak pentadbir.`,
      recipientUid: existing.submittedBy,
      type: status === 'Disahkan' ? 'success' : status === 'Memerlukan Pembetulan' ? 'warning' : 'danger',
      relatedRecordId: achievementId,
      relatedRecordType: 'achievement',
      destinationRoute: `/pencapaian`,
    });

    return updated;
  }

  // ==========================================
  // DOCUMENTS & STORAGE
  // ==========================================
  public getDocuments(filters?: {
    productId?: string;
    category?: string;
    year?: number;
    departmentId?: string;
  }): ArchiveDocument[] {
    let documents = getLocalItem<ArchiveDocument[]>(STORAGE_KEYS.DOCUMENTS, []);

    if (!filters) return documents;

    if (filters.productId) {
      documents = documents.filter(d => d.productId === filters.productId);
    }
    if (filters.category && filters.category !== 'SEMUA') {
      documents = documents.filter(d => d.category === filters.category);
    }
    if (filters.year) {
      documents = documents.filter(d => d.reportingYear === filters.year);
    }
    if (filters.departmentId && filters.departmentId !== 'SEMUA') {
      documents = documents.filter(d => d.departmentId === filters.departmentId);
    }

    return documents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public uploadDocument(
    docMeta: Omit<ArchiveDocument, 'documentId' | 'fileUrl' | 'storagePath' | 'version' | 'createdAt' | 'updatedAt' | 'versions'>,
    file: File | { name: string; size: number; type: string; url?: string },
    actor: UserProfile
  ): ArchiveDocument {
    const product = this.getProductById(docMeta.productId);
    const documents = this.getDocuments();
    const documentId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Create realistic storage path
    const year = docMeta.reportingYear || new Date().getFullYear();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `archive/${year}/${docMeta.productId}/${documentId}_${cleanFileName}`;
    
    // In local persistent mode, generate blob URL or simulated preview URL
    const fileUrl = 'url' in file && file.url 
      ? file.url 
      : URL.createObjectURL ? URL.createObjectURL(file as File) : `https://polibanting.edu.my/sapie/files/${documentId}`;

    const newDoc: ArchiveDocument = {
      ...docMeta,
      documentId,
      productTitle: product?.title || docMeta.productTitle,
      productArchiveCode: product?.archiveCode || docMeta.productArchiveCode,
      departmentId: product?.departmentId || docMeta.departmentId,
      originalFilename: file.name,
      storagePath,
      fileUrl,
      mimeType: file.type || 'application/octet-stream',
      fileSize: file.size,
      version: 1,
      uploadedBy: actor.uid,
      uploadedByName: actor.fullName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versions: [
        {
          versionId: `ver-1-${documentId}`,
          documentId,
          versionNumber: 1,
          storagePath,
          fileUrl,
          originalFilename: file.name,
          fileSize: file.size,
          uploadedBy: actor.uid,
          uploadedByName: actor.fullName,
          changeNotes: 'Muat naik versi asal.',
          createdAt: new Date().toISOString(),
        }
      ],
    };

    documents.unshift(newDoc);
    setLocalItem(STORAGE_KEYS.DOCUMENTS, documents);

    // Refresh document count
    if (product) {
      this.refreshProductCounts(product.productId);
    }

    this.createAuditLog({
      actorUid: actor.uid,
      actorName: actor.fullName,
      actorRole: actor.role,
      action: 'DOCUMENT_UPLOAD',
      entityType: 'Document',
      entityId: documentId,
      outcome: 'Berjaya',
      details: `Memuat naik dokumen "${newDoc.title}" (${file.name}, ${(file.size / 1024).toFixed(1)} KB) bagi produk ${product?.archiveCode || docMeta.productId}`,
    });

    return newDoc;
  }

  // Helper: Refresh computed counts on product
  private refreshProductCounts(productId: string): void {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.productId === productId);
    if (idx !== -1) {
      const achievements = this.getAchievements({ productId });
      const documents = this.getDocuments({ productId });
      products[idx].achievementsCount = achievements.filter(a => a.verificationStatus === 'Disahkan').length;
      products[idx].documentsCount = documents.length;
      setLocalItem(STORAGE_KEYS.PRODUCTS, products);
    }
  }

  // ==========================================
  // AUDIT LOGS
  // ==========================================
  public getAuditLogs(filters?: {
    action?: AuditAction;
    actorUid?: string;
    entityType?: string;
  }): AuditLogEntry[] {
    let logs = getLocalItem<AuditLogEntry[]>(STORAGE_KEYS.AUDIT, []);
    if (!filters) return logs;

    if (filters.action) {
      logs = logs.filter(l => l.action === filters.action);
    }
    if (filters.actorUid) {
      logs = logs.filter(l => l.actorUid === filters.actorUid);
    }
    if (filters.entityType) {
      logs = logs.filter(l => l.entityType === filters.entityType);
    }

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public createAuditLog(entry: Omit<AuditLogEntry, 'auditId' | 'timestamp'>): void {
    const logs = getLocalItem<AuditLogEntry[]>(STORAGE_KEYS.AUDIT, []);
    const auditId = `aud-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fullLog: AuditLogEntry = {
      ...entry,
      auditId,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(fullLog);
    // Keep reasonable max logs in localStorage
    if (logs.length > 500) {
      logs.splice(500);
    }
    setLocalItem(STORAGE_KEYS.AUDIT, logs);
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  public getNotifications(userUid?: string): AppNotification[] {
    const notifications = getLocalItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    if (!userUid) return notifications;
    return notifications.filter(n => n.recipientUid === userUid || n.recipientUid === 'ALL_USERS' || n.recipientUid === 'ALL_ADMINS');
  }

  public createNotification(data: Omit<AppNotification, 'notificationId' | 'read' | 'createdAt'>): void {
    const notifications = getLocalItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const newNotif: AppNotification = {
      ...data,
      notificationId: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    notifications.unshift(newNotif);
    if (notifications.length > 100) notifications.splice(100);
    setLocalItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  public markNotificationAsRead(notificationId: string): void {
    const notifications = getLocalItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const item = notifications.find(n => n.notificationId === notificationId);
    if (item) {
      item.read = true;
      setLocalItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
  }

  public markAllNotificationsAsRead(userUid: string): void {
    const notifications = getLocalItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    notifications.forEach(n => {
      if (n.recipientUid === userUid || n.recipientUid === 'ALL_USERS' || n.recipientUid === 'ALL_ADMINS') {
        n.read = true;
      }
    });
    setLocalItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  // ==========================================
  // USERS & ROLES
  // ==========================================
  public getUsers(): UserProfile[] {
    return getLocalItem<UserProfile[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  public getUserById(uid: string): UserProfile | null {
    const users = this.getUsers();
    return users.find(u => u.uid === uid) || null;
  }

  public getUserByEmail(email: string): UserProfile | null {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  public createUser(userData: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>, actor: UserProfile): UserProfile {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error(`Alamat e-mel ${userData.email} telah didaftarkan dalam sistem.`);
    }

    const uid = `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newUser: UserProfile = {
      ...userData,
      uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    setLocalItem(STORAGE_KEYS.USERS, users);

    this.createAuditLog({
      actorUid: actor.uid,
      actorName: actor.fullName,
      actorRole: actor.role,
      action: 'USER_CREATE',
      entityType: 'User',
      entityId: uid,
      entityIdentifier: newUser.email,
      outcome: 'Berjaya',
      details: `Mendaftar pengguna baharu: ${newUser.fullName} (${newUser.email}) dengan peranan ${newUser.role}`,
    });

    return newUser;
  }

  public updateUser(uid: string, updates: Partial<UserProfile>, actor: UserProfile): UserProfile {
    const users = this.getUsers();
    const index = users.findIndex(u => u.uid === uid);
    if (index === -1) throw new Error('Pengguna tidak dijumpai');

    const previousRole = users[index].role;
    const previousStatus = users[index].active;

    const updatedUser: UserProfile = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    users[index] = updatedUser;
    setLocalItem(STORAGE_KEYS.USERS, users);

    // Audit logs for role or status changes
    if (updates.role && updates.role !== previousRole) {
      this.createAuditLog({
        actorUid: actor.uid,
        actorName: actor.fullName,
        actorRole: actor.role,
        action: 'USER_ROLE_CHANGE',
        entityType: 'User',
        entityId: uid,
        entityIdentifier: updatedUser.email,
        outcome: 'Berjaya',
        details: `Menukar peranan pengguna ${updatedUser.fullName} dari ${previousRole} kepada ${updates.role}`,
      });
    }

    if (updates.active !== undefined && updates.active !== previousStatus) {
      this.createAuditLog({
        actorUid: actor.uid,
        actorName: actor.fullName,
        actorRole: actor.role,
        action: 'USER_STATUS_CHANGE',
        entityType: 'User',
        entityId: uid,
        entityIdentifier: updatedUser.email,
        outcome: 'Berjaya',
        details: `Menukar status keaktifan pengguna ${updatedUser.fullName} kepada ${updates.active ? 'Aktif' : 'Tidak Aktif'}`,
      });
    }

    return updatedUser;
  }

  // ==========================================
  // SYSTEM SETTINGS
  // ==========================================
  public getSystemSettings(): SystemSettings {
    return getLocalItem<SystemSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SYSTEM_SETTINGS);
  }

  public updateSystemSettings(updates: Partial<SystemSettings>, actor: UserProfile): SystemSettings {
    const current = this.getSystemSettings();
    const updated: SystemSettings = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: actor.fullName,
    };

    setLocalItem(STORAGE_KEYS.SETTINGS, updated);

    this.createAuditLog({
      actorUid: actor.uid,
      actorName: actor.fullName,
      actorRole: actor.role,
      action: 'SETTINGS_UPDATE',
      entityType: 'Settings',
      outcome: 'Berjaya',
      details: `Mengemas kini tetapan pentadbiran sistem SAPIe oleh ${actor.fullName}`,
    });

    return updated;
  }

  // ==========================================
  // DASHBOARD COMPUTED METRICS
  // ==========================================
  public getDashboardStats(filters?: {
    year?: number;
    departmentId?: string;
  }) {
    let products = this.getProducts();
    let achievements = this.getAchievements();
    let documents = this.getDocuments();

    if (filters?.year) {
      products = products.filter(p => p.registrationYear === filters.year || p.developmentYear === filters.year);
      achievements = achievements.filter(a => a.achievementYear === filters.year);
      documents = documents.filter(d => d.reportingYear === filters.year);
    }

    if (filters?.departmentId && filters.departmentId !== 'SEMUA') {
      products = products.filter(p => p.departmentId === filters.departmentId);
      achievements = achievements.filter(a => a.departmentId === filters.departmentId);
      documents = documents.filter(d => d.departmentId === filters.departmentId);
    }

    const totalProducts = products.length;
    const approvedProducts = products.filter(p => p.registrationStatus === 'Diluluskan').length;
    const inReviewProducts = products.filter(p => p.registrationStatus === 'Dalam Semakan' || p.registrationStatus === 'Dihantar untuk Semakan').length;
    const inDevelopmentProducts = products.filter(p => p.developmentStatus === 'Dalam Pembangunan' || p.developmentStatus === 'Perancangan').length;
    
    // Distinct verified achievements vs total
    const verifiedAchievements = achievements.filter(a => a.verificationStatus === 'Disahkan').length;
    const distinctProductsWithAchievements = new Set(achievements.filter(a => a.verificationStatus === 'Disahkan').map(a => a.productId)).size;

    const totalDocuments = documents.length;
    const distinctDepartments = new Set(products.map(p => p.departmentId)).size;
    const distinctCreators = new Set(products.map(p => p.primaryCreatorEmail)).size;

    return {
      totalProducts,
      approvedProducts,
      inReviewProducts,
      inDevelopmentProducts,
      totalAchievements: verifiedAchievements,
      allAchievementRecords: achievements.length,
      distinctProductsWithAchievements,
      totalDocuments,
      distinctDepartments,
      distinctCreators,
    };
  }
}

export const dbService = DatabaseService.getInstance();
