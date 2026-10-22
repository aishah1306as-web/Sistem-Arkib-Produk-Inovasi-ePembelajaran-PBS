export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const DEFAULT_ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.xlsx', '.pptx', '.jpg', '.jpeg', '.png', '.webp', '.zip'];
const DISALLOWED_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.sh', '.ps1', '.vbs', '.msi', '.dll', '.com', '.scr', '.pif', '.jar', '.php', '.asp', '.jsp'
];

export function validateUploadedFile(
  file: File,
  maxSizeMB: number = 25,
  allowedExtensions: string[] = DEFAULT_ALLOWED_EXTENSIONS
): ValidationResult {
  const filename = file.name.toLowerCase();
  
  // 1. Check for dangerous executable extensions
  for (const dangerous of DISALLOWED_EXTENSIONS) {
    if (filename.endsWith(dangerous)) {
      return {
        valid: false,
        error: `Fail jenis eksekusi (${dangerous}) adalah dilarang keras atas faktor keselamatan.`,
      };
    }
  }

  // 2. Check allowed extensions
  const hasAllowedExt = allowedExtensions.some(ext => filename.endsWith(ext.toLowerCase()));
  if (!hasAllowedExt) {
    return {
      valid: false,
      error: `Format fail tidak disokong. Sila muat naik format: ${allowedExtensions.join(', ')}`,
    };
  }

  // 3. Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Saiz fail (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi had maksimum ${maxSizeMB} MB.`,
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'Fail yang dimuat naik adalah kosong (0 bait).',
    };
  }

  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
