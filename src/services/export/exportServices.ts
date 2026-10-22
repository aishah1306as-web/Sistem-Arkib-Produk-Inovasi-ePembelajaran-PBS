import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { InnovationProduct } from '../../types/product';
import { Achievement } from '../../types/achievement';
import { ArchiveDocument } from '../../types/document';
import { formatDateMs } from '../../utils/dateFormatter';

export interface ReportMeta {
  title: string;
  generatedByName: string;
  generatedDate: string;
  departmentFilter?: string;
  yearFilter?: string | number;
  categoryFilter?: string;
}

// ==========================================
// 1. PDF EXPORT SERVICE
// ==========================================
export function exportProductsToPDF(products: InnovationProduct[], meta: ReportMeta): void {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Header Banner
  doc.setFillColor(22, 58, 95); // #163A5F Navy
  doc.rect(0, 0, 297, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('POLITEKNIK BANTING SELANGOR', 14, 10);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('SISTEM ARKIB PRODUK INOVASI ePEMBELAJARAN (SAPIe)', 14, 16);

  // Metadata block
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(meta.title, 14, 33);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  const filterDesc = `Tahun: ${meta.yearFilter || 'Semua'} | Jabatan: ${meta.departmentFilter || 'Semua'} | Dijana oleh: ${meta.generatedByName} pada ${formatDateMs(meta.generatedDate)}`;
  doc.text(filterDesc, 14, 38);

  // Table Data
  const tableData = products.map((p, idx) => [
    idx + 1,
    p.archiveCode,
    p.title,
    p.departmentName || p.departmentId,
    p.categoryName || p.categoryId,
    p.primaryCreatorName,
    p.developmentYear.toString(),
    p.registrationStatus,
    (p.achievementsCount || 0).toString(),
  ]);

  autoTable(doc, {
    startY: 42,
    head: [['Bil', 'Kod Arkib', 'Tajuk Produk', 'Jabatan', 'Kategori', 'Pencipta Utama', 'Tahun', 'Status', 'Pencapaian']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [31, 41, 55],
    },
    headStyles: {
      fillColor: [22, 58, 95],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Footer page numbering
      const str = `Mukasurat ${data.pageNumber}`;
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(str, 297 - 30, 205);
      doc.text('Dokumen Rasmi Dijana oleh SAPIe - Politeknik Banting Selangor', 14, 205);
    },
  });

  doc.save(`SAPIe_Laporan_Produk_${Date.now()}.pdf`);
}

export function exportAchievementsToPDF(achievements: Achievement[], meta: ReportMeta): void {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Header Banner
  doc.setFillColor(22, 58, 95);
  doc.rect(0, 0, 297, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('POLITEKNIK BANTING SELANGOR', 14, 10);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('SISTEM ARKIB PRODUK INOVASI ePEMBELAJARAN (SAPIe)', 14, 16);

  // Metadata block
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(meta.title, 14, 33);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  const filterDesc = `Tahun: ${meta.yearFilter || 'Semua'} | Dijana oleh: ${meta.generatedByName} pada ${formatDateMs(meta.generatedDate)}`;
  doc.text(filterDesc, 14, 38);

  const tableData = achievements.map((a, idx) => [
    idx + 1,
    a.productArchiveCode || '-',
    a.title,
    a.eventName,
    a.recognitionLevel,
    a.resultType,
    a.achievementYear.toString(),
    a.verificationStatus,
    a.verifiedByName || '-',
  ]);

  autoTable(doc, {
    startY: 42,
    head: [['Bil', 'Kod Produk', 'Tajuk Pencapaian', 'Pertandingan / Program', 'Peringkat', 'Keputusan / Anugerah', 'Tahun', 'Status Pengesahan', 'Disahkan Oleh']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2.5, textColor: [31, 41, 55] },
    headStyles: { fillColor: [22, 58, 95], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Mukasurat ${data.pageNumber}`, 297 - 30, 205);
      doc.text('Dokumen Rasmi Dijana oleh SAPIe - Politeknik Banting Selangor', 14, 205);
    },
  });

  doc.save(`SAPIe_Laporan_Pencapaian_${Date.now()}.pdf`);
}

// ==========================================
// 2. EXCEL (XLSX) EXPORT SERVICE
// ==========================================
export function exportProductsToExcel(products: InnovationProduct[], meta: ReportMeta): void {
  const rows = products.map((p, idx) => ({
    'Bil': idx + 1,
    'Kod Arkib': p.archiveCode,
    'Tajuk Produk Inovasi': p.title,
    'Jabatan': p.departmentName || p.departmentId,
    'Program': p.program,
    'Kursus': `${p.courseCode ? p.courseCode + ' - ' : ''}${p.courseName}`,
    'Kategori Utama': p.categoryName || p.categoryId,
    'Teknologi Digunakan': p.technologies.join(', '),
    'Pencipta Utama': p.primaryCreatorName,
    'E-mel Pencipta': p.primaryCreatorEmail,
    'Bilangan Ahli Pasukan': p.teamMembers.length,
    'Tahun Pembangunan': p.developmentYear,
    'Tahun Pendaftaran': p.registrationYear,
    'Status Pembangunan': p.developmentStatus,
    'Status Pendaftaran': p.registrationStatus,
    'Pautan Produk': p.productUrl || '-',
    'Jumlah Pencapaian Disahkan': p.achievementsCount || 0,
    'Jumlah Dokumen': p.documentsCount || 0,
    'Tarikh Diluluskan': p.approvedAt ? formatDateMs(p.approvedAt) : '-',
    'Tarikh Didaftarkan': formatDateMs(p.createdAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Arkib Produk Inovasi');

  // Auto column widths
  const maxColWidths = [
    { wch: 6 },  // Bil
    { wch: 18 }, // Kod Arkib
    { wch: 35 }, // Tajuk
    { wch: 25 }, // Jabatan
    { wch: 12 }, // Program
    { wch: 25 }, // Kursus
    { wch: 25 }, // Kategori
    { wch: 25 }, // Teknologi
    { wch: 25 }, // Pencipta
    { wch: 25 }, // Email
    { wch: 15 }, // Ahli
    { wch: 12 }, // Thn Dev
    { wch: 12 }, // Thn Reg
    { wch: 18 }, // Status Dev
    { wch: 18 }, // Status Reg
    { wch: 30 }, // Pautan
    { wch: 12 }, // Jml Pencapaian
    { wch: 12 }, // Jml Dokumen
    { wch: 18 }, // Tkh Lulus
    { wch: 18 }, // Tkh Daftar
  ];
  worksheet['!cols'] = maxColWidths;

  XLSX.writeFile(workbook, `SAPIe_Produk_Inovasi_${Date.now()}.xlsx`);
}

export function exportAchievementsToExcel(achievements: Achievement[]): void {
  const rows = achievements.map((a, idx) => ({
    'Bil': idx + 1,
    'Kod Produk': a.productArchiveCode || '-',
    'Tajuk Produk': a.productTitle || '-',
    'Tajuk Pencapaian': a.title,
    'Kategori': a.category,
    'Nama Program / Pertandingan': a.eventName,
    'Penganjur': a.organizer,
    'Peringkat Pengiktirafan': a.recognitionLevel,
    'Keputusan / Anugerah': a.resultType,
    'Tarikh Dicapai': formatDateMs(a.achievementDate),
    'Tahun': a.achievementYear,
    'Status Pengesahan': a.verificationStatus,
    'Dihantar Oleh': a.submittedByName || a.submittedBy,
    'Disahkan Oleh': a.verifiedByName || '-',
    'Tarikh Pengesahan': a.verifiedAt ? formatDateMs(a.verifiedAt) : '-',
    'Catatan Pentadbir': a.administrativeNotes || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Pencapaian & Anugerah');
  XLSX.writeFile(workbook, `SAPIe_Pencapaian_Inovasi_${Date.now()}.xlsx`);
}

// ==========================================
// 3. CSV EXPORT SERVICE (With UTF-8 BOM)
// ==========================================
export function exportProductsToCSV(products: InnovationProduct[]): void {
  const headers = [
    'Bil',
    'Kod Arkib',
    'Tajuk Produk Inovasi',
    'Jabatan',
    'Program',
    'Kategori',
    'Pencipta Utama',
    'Tahun Pembangunan',
    'Status Pendaftaran',
    'Jumlah Pencapaian',
    'Tarikh Didaftar'
  ];

  const escapeCSV = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = products.map((p, idx) => [
    idx + 1,
    p.archiveCode,
    p.title,
    p.departmentName || p.departmentId,
    p.program,
    p.categoryName || p.categoryId,
    p.primaryCreatorName,
    p.developmentYear,
    p.registrationStatus,
    p.achievementsCount || 0,
    formatDateMs(p.createdAt),
  ].map(escapeCSV).join(','));

  // UTF-8 BOM ensures Excel on Windows displays accents and Malay text properly
  const csvContent = '\uFEFF' + [headers.map(escapeCSV).join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `SAPIe_Produk_Inovasi_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
