export interface CourseSummary {
  id: string;
  courseName: string;
  tutorName: string;
  level: number;
  term: number;
  isPractical: boolean;
  fileCount: number;
}

export interface CourseListResponse {
  items: CourseSummary[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CourseFileSummary {
  id: number;
  title: string;
  originalName: string;
  url?: string;
  mimeType: string;
  extension: string;
  sizeBytes: number;
}

export interface CourseDetail extends CourseSummary {
  files: CourseFileSummary[];
}

export interface CoursesFilters {
  level?: number;
  term?: number;
  isPractical?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const LEVELS = [
  { value: 1, label: "المستوى الأول" },
  { value: 2, label: "المستوى الثاني" },
  { value: 3, label: "المستوى الثالث" },
  { value: 4, label: "المستوى الرابع" },
] as const;

export const TERMS = [
  { value: 1, label: "الفصل الأول" },
  { value: 2, label: "الفصل الثاني" },
] as const;

export function levelLabel(level: number): string {
  return LEVELS.find((l) => l.value === level)?.label ?? `المستوى ${level}`;
}

export function termLabel(term: number): string {
  return TERMS.find((t) => t.value === term)?.label ?? `الفصل ${term}`;
}
