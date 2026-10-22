/**
 * Format kod arkib piawai: PBS-EP-[TAHUN]-[NOMBOR_SIRI_4_DIGIT]
 * Contoh: PBS-EP-2026-0001
 */
export function formatArchiveCode(prefix: string = 'PBS-EP', year: number, sequenceNumber: number): string {
  const paddedSeq = sequenceNumber.toString().padStart(4, '0');
  return `${prefix}-${year}-${paddedSeq}`;
}

export function parseArchiveCode(code: string): { prefix: string; year: number; sequence: number } | null {
  const parts = code.split('-');
  if (parts.length === 4) {
    return {
      prefix: `${parts[0]}-${parts[1]}`,
      year: parseInt(parts[2], 10),
      sequence: parseInt(parts[3], 10),
    };
  }
  return null;
}
