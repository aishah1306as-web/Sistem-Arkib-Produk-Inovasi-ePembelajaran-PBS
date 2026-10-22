import { Department } from './auth';
import { ProductCategory } from './product';

export interface SystemSettings {
  institutionName: string;
  systemName: string;
  systemShortName: string;
  archiveCodePrefix: string; // e.g. "PBS-EP"
  currentAcademicYear: number;
  allowedFileTypes: string[]; // ['.pdf', '.docx', '.xlsx', '.pptx', '.jpg', '.png', '.webp']
  maxFileSizeMB: number; // e.g. 25 MB
  departments: Department[];
  categories: ProductCategory[];
  technologies: string[];
  achievementCategories: string[];
  recognitionLevels: string[];
  documentCategories: string[];
  retentionPolicyYears: number;
  maintenanceMode: boolean;
  contactEmail: string;
  updatedAt: string;
  updatedBy: string;
}
