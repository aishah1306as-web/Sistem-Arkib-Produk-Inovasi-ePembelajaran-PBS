import { dbService } from '../storage/databaseService';
import { InnovationProduct } from '../../types/product';
import { Achievement } from '../../types/achievement';
import { ArchiveDocument } from '../../types/document';
import { INITIAL_USERS } from '../storage/initialData';

export const SYNTHETIC_TAG = '[SINTETIK - UJIAN]';

export function isSyntheticRecord(title: string): boolean {
  return title.includes(SYNTHETIC_TAG);
}

export function seedSyntheticData(): { productsCount: number; achievementsCount: number; docsCount: number } {
  const adminActor = INITIAL_USERS[0]; // Super Admin
  const pensyarahJkm = INITIAL_USERS[3]; // Dr. Norazlina

  // Check if synthetic products already exist to avoid duplicate seeding
  const existing = dbService.getProducts();
  const alreadySeeded = existing.some(p => isSyntheticRecord(p.title));
  if (alreadySeeded) {
    return {
      productsCount: existing.filter(p => isSyntheticRecord(p.title)).length,
      achievementsCount: dbService.getAchievements().filter(a => isSyntheticRecord(a.title)).length,
      docsCount: dbService.getDocuments().filter(d => isSyntheticRecord(d.title)).length,
    };
  }

  // Sample Product 1: CAD 3D Augmented Reality Module (JKM)
  const prod1 = dbService.createProduct({
    title: `${SYNTHETIC_TAG} Modul Realiti Tertimbuh (AR) Visualisasi Enjin Pembakaran Dalam`,
    summary: 'Modul interaktif berasaskan Augmented Reality bagi membantu pelajar kejuruteraan mekanikal memahami kitaran lejang 4 dan pemasangan komponen silinder enjin.',
    description: 'Penyelidikan mendapati pelajar sukar membayangkan aliran bahan api dan pemasaan injap secara 2D. Modul ini menggabungkan kad penanda AR fizikal dengan model 3D interaktif pada telefon pintar untuk visualisasi langsung semasa sesi amali bengkel.',
    objectives: '1. Meningkatkan daya visualisasi 3D pelajar terhadap komponen dalaman enjin.\n2. Mengurangkan kadar ralat pemasangan semasa amali bengkel.\n3. Menyediakan bahan ulang kaji interaktif kendiri bila-bila masa.',
    problemStatement: 'Pelajar semester 2 sering mengalami kesukaran memahami hubung kait putaran aci engkol dan pemasaan injap hanya melalui gambar rajah statik buku teks.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    departmentId: 'JKM',
    program: 'Diploma Kejuruteraan Mekanikal (DKM)',
    courseCode: 'DJJ20053',
    courseName: 'Thermodynamics & Engine Mechanics',
    semester: 'Semester 2',
    targetAudience: 'Pelajar Diploma Kejuruteraan Mekanikal Politeknik',
    pedagogicalMethod: 'Pembelajaran Berasaskan Masalah (PBL) dan sokongan amali makmal kendiri.',
    categoryId: 'cat-8', // Augmented Reality
    tags: ['Augmented Reality', 'Kejuruteraan Mekanikal', 'Enjin 4 Lejang', 'Visualisasi 3D'],
    technologies: ['Unity 3D', 'Vuforia AR', 'Blender', 'Canva'],
    primaryCreatorUid: pensyarahJkm.uid,
    primaryCreatorName: pensyarahJkm.fullName,
    primaryCreatorEmail: pensyarahJkm.email,
    primaryCreatorStaffId: pensyarahJkm.staffId,
    teamMembers: [
      {
        membershipId: 'mem-1',
        displayName: 'Ir. Ahmad Zulkifli bin Yahya',
        roleInProject: 'Penilai Teknikal & Kandungan Silibus',
        email: 'pegawai.jkm@polibanting.edu.my',
        institution: 'Politeknik Banting Selangor',
      },
      {
        membershipId: 'mem-2',
        displayName: 'Muhammad Haziq (Pelajar Tahun Akhir)',
        roleInProject: 'Pereka Model 3D Blender',
        institution: 'Politeknik Banting Selangor',
      }
    ],
    developmentYear: 2025,
    registrationYear: 2026,
    developmentStatus: 'Sedia Digunakan',
    version: '2.1',
    productUrl: 'https://ar-engine.polibanting.edu.my',
    demoUrl: 'https://youtube.com/watch?v=sample-ar-demo',
    implementationNotes: 'Telah diuji kepada 65 orang pelajar DKM sesi I 2025/2026 dengan peningkatan markah amali purata 24%.',
    registrationStatus: 'Diluluskan',
    createdBy: pensyarahJkm.uid,
  }, adminActor, false);

  // Directly approve prod1 so it appears in the archive
  dbService.approveProduct(prod1.productId, adminActor, 'Produk inovasi telah dinilai dan memenuhi standard arkib UePM.');

  // Sample Product 2: Aircraft Hydraulic Simulator (JPP)
  const prod2 = dbService.createProduct({
    title: `${SYNTHETIC_TAG} Simulator Interaktif Sistem Hidraulik Pesawat Ringan`,
    summary: 'Aplikasi simulasi digital berasaskan web yang memodelkan aliran cecair hidraulik, kawalan pam, dan injap penggerak permukaan kawalan penerbangan.',
    description: 'Sistem ini membolehkan pelajar menguji situasi kegagalan hidraulik (hydraulic failure scenario) secara selamat sebelum mengendalikan rig ujian fizikal di hangar penyelenggaraan pesawat.',
    objectives: '1. Memberikan simulasi selamat bagi senario kecemasan sistem hidraulik.\n2. Menjimatkan kos bahan uji cecair hidraulik.\n3. Melatih prosedur diagnostik langkah demi langkah.',
    problemStatement: 'Ujian kegagalan tekanan hidraulik pada pesawat sebenar mempunyai risiko kerosakan perkakasan yang tinggi dan kos cecair hidraulik Skydrol yang mahal.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&auto=format&fit=crop&q=80',
    departmentId: 'JPP',
    program: 'Diploma Kejuruteraan Penyelenggaraan Pesawat (DAD)',
    courseCode: 'DAT30112',
    courseName: 'Aircraft Hydraulic and Pneumatic Systems',
    semester: 'Semester 4',
    targetAudience: 'Pelajar Penyelenggaraan Pesawat DAD & Pensyarah Amali',
    pedagogicalMethod: 'Simulasi Situasi Nyata & Latihan Diagnostik Berpandu.',
    categoryId: 'cat-7', // Simulasi
    tags: ['Simulasi Digital', 'Penyelenggaraan Pesawat', 'Hidraulik', 'Keselamatan Hangar'],
    technologies: ['Simulink / MATLAB', 'H5P', 'CIDOS (Moodle)'],
    primaryCreatorUid: 'user-pegawai-jpp',
    primaryCreatorName: 'Ts. Mohd Khairul bin Idris',
    primaryCreatorEmail: 'khairul.idris@polibanting.edu.my',
    primaryCreatorStaffId: 'PBS-JPP-008',
    teamMembers: [],
    developmentYear: 2026,
    registrationYear: 2026,
    developmentStatus: 'Pengujian & Penilaian',
    version: '1.0',
    productUrl: 'https://simulator-jpp.polibanting.edu.my',
    registrationStatus: 'Diluluskan',
    createdBy: adminActor.uid,
  }, adminActor, false);

  dbService.approveProduct(prod2.productId, adminActor, 'Memenuhi keperluan arkib digital JPP.');

  // Sample Product 3: Interactive LMS Gamification (JMSK - Dalam Semakan)
  const prod3 = dbService.createProduct({
    title: `${SYNTHETIC_TAG} Gamifikasi Matematik Kejuruteraan: Quest Calculus CIDOS`,
    summary: 'Siri cabaran kuiz interaktif bermodul dengan papan mata (leaderboard) dan lencana digital bagi topik pembezaan dan kamiran.',
    description: 'Modul ini disepadukan ke dalam CIDOS untuk merangsang minat pelajar semester 1 terhadap topik kalkulus melalui elemen permainan digital dan ganjaran pencapaian.',
    objectives: 'Meningkatkan penglibatan pelajar dalam latihan kendiri kalkulus.',
    problemStatement: 'Kadar kegagalan topik kalkulus asas yang membimbangkan pada peperiksaan akhir.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=600&auto=format&fit=crop&q=80',
    departmentId: 'JMSK',
    program: 'Semua Program Kejuruteraan',
    courseCode: 'DBM10013',
    courseName: 'Engineering Mathematics 1',
    semester: 'Semester 1',
    targetAudience: 'Pelajar Baharu Kejuruteraan',
    pedagogicalMethod: 'Gamifikasi dan Penilaian Formatif Kendiri.',
    categoryId: 'cat-6', // Gamifikasi
    tags: ['Gamifikasi', 'Matematik', 'Kalkulus', 'CIDOS'],
    technologies: ['CIDOS (Moodle)', 'H5P', 'Kahoot / Quizizz'],
    primaryCreatorUid: pensyarahJkm.uid,
    primaryCreatorName: pensyarahJkm.fullName,
    primaryCreatorEmail: pensyarahJkm.email,
    teamMembers: [],
    developmentYear: 2026,
    registrationYear: 2026,
    developmentStatus: 'Dalam Pembangunan',
    version: '0.9',
    registrationStatus: 'Dalam Semakan',
    createdBy: pensyarahJkm.uid,
  }, adminActor, false);

  // Sample Achievements for Prod 1
  const ach1 = dbService.createAchievement({
    productId: prod1.productId,
    productTitle: prod1.title,
    productArchiveCode: prod1.archiveCode,
    departmentId: prod1.departmentId,
    title: `${SYNTHETIC_TAG} Pingat Emas Pertandingan Inovasi PdP Peringkat Kebangsaan (i-CompEx)`,
    category: 'Pertandingan Inovasi',
    eventName: 'National Innovation and Invention Competition through Exhibition (i-CompEx 2025)',
    organizer: 'Politeknik Sultan Abdul Halim Muadzam Shah (POLIMAS)',
    recognitionLevel: 'Kebangsaan',
    resultType: 'Emas',
    achievementDate: '2025-07-16',
    achievementYear: 2025,
    description: 'Memenangi Pingat Emas bagi kategori Produk Pendidikan Digital & Multimedia.',
    referenceUrl: 'https://icompex.edu.my/results-2025',
  }, pensyarahJkm);

  dbService.verifyAchievement(ach1.achievementId, 'Disahkan', 'Disahkan sah oleh Pentadbir UePM berdasarkan sijil rasmi.', adminActor);

  const ach2 = dbService.createAchievement({
    productId: prod1.productId,
    productTitle: prod1.title,
    productArchiveCode: prod1.archiveCode,
    departmentId: prod1.departmentId,
    title: `${SYNTHETIC_TAG} Anugerah Khas Inovasi Pengajaran Politeknik Banting Selangor`,
    category: 'Anugerah Institusi',
    eventName: 'Hari Kualiti & Inovasi PBS 2025',
    organizer: 'Politeknik Banting Selangor',
    recognitionLevel: 'Institusi',
    resultType: 'Anugerah Khas',
    achievementDate: '2025-11-20',
    achievementYear: 2025,
    description: 'Anugerah Khas Ketua Jabatan atas sumbangan inovasi digital dalam pengajaran bengkel.',
  }, pensyarahJkm);

  dbService.verifyAchievement(ach2.achievementId, 'Disahkan', 'Disahkan melalui minit mesyuarat jawatankuasa inovasi.', adminActor);

  // Sample Documents for Prod 1
  dbService.uploadDocument({
    productId: prod1.productId,
    productTitle: prod1.title,
    productArchiveCode: prod1.archiveCode,
    departmentId: prod1.departmentId,
    title: `${SYNTHETIC_TAG} Kertas Konsep & Manual Pengguna Modul AR Enjin`,
    category: 'Manual Pengguna',
    description: 'Panduan pemasangan aplikasi AR pada telefon pintar Android dan susunan kad penanda fizikal.',
    reportingYear: 2025,
    accessClassification: 'Dalaman',
    verificationStatus: 'Disahkan',
    uploadedBy: pensyarahJkm.uid,
    uploadedByName: pensyarahJkm.fullName,
  }, {
    name: 'Manual_Pengguna_Modul_AR_Enjin_PBS.pdf',
    size: 2450000,
    type: 'application/pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  }, pensyarahJkm);

  dbService.uploadDocument({
    productId: prod1.productId,
    productTitle: prod1.title,
    productArchiveCode: prod1.archiveCode,
    departmentId: prod1.departmentId,
    title: `${SYNTHETIC_TAG} Laporan Penilaian Impak Pembelajaran & Ujian Pelajar`,
    category: 'Penilaian dan Impak',
    description: 'Analisis statistik perbandingan markah kuiz dan amali sebelum dan selepas penggunaan produk inovasi.',
    reportingYear: 2026,
    accessClassification: 'Terhad',
    verificationStatus: 'Disahkan',
    uploadedBy: pensyarahJkm.uid,
    uploadedByName: pensyarahJkm.fullName,
  }, {
    name: 'Laporan_Impak_Pembelajaran_2026.docx',
    size: 1120000,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  }, pensyarahJkm);

  return {
    productsCount: 3,
    achievementsCount: 2,
    docsCount: 2,
  };
}

export function clearSyntheticData(): void {
  let products = dbService.getProducts();
  const synthProductIds = new Set(products.filter(p => isSyntheticRecord(p.title)).map(p => p.productId));

  // Remove products
  products = products.filter(p => !synthProductIds.has(p.productId));
  localStorage.setItem('sapie_products_v1', JSON.stringify(products));

  // Remove achievements
  let achievements = dbService.getAchievements();
  achievements = achievements.filter(a => !synthProductIds.has(a.productId) && !isSyntheticRecord(a.title));
  localStorage.setItem('sapie_achievements_v1', JSON.stringify(achievements));

  // Remove documents
  let documents = dbService.getDocuments();
  documents = documents.filter(d => !synthProductIds.has(d.productId) && !isSyntheticRecord(d.title));
  localStorage.setItem('sapie_documents_v1', JSON.stringify(documents));
}
