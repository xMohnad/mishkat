import "server-only";

import { notFound } from "next/navigation";

import type { CourseDetail, CourseListResponse, CoursesFilters, CourseSummary } from "@/lib/types";

const API_URL = (process.env.API_URL ?? "http://localhost:8000") + "/api";

class ApiError extends Error {}

async function apiFetch<T>(path: string, revalidate: number | false, notFoundOnMissing = false): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      next: revalidate === false ? undefined : { revalidate },
      cache: revalidate === false ? "no-store" : undefined,
    });
  } catch {
    throw new ApiError("تعذّر الوصول إلى الخادم.");
  }

  // 422 covers a malformed id — treat it as "not found" too.
  if (notFoundOnMissing && (res.status === 404 || res.status === 422)) {
    notFound();
  }

  if (!res.ok) {
    throw new ApiError(`فشل الطلب (${res.status}). حاول مرة أخرى لاحقًا.`);
  }

  return res.json() as Promise<T>;
}

/** Fetch current semester courses */
export function getCurrentCourses(): Promise<CourseSummary[]> {
  return apiFetch<CourseSummary[]>("/courses/current", 60);
}

/** Fetch paginated courses with filters */
export function getCourses(filters: CoursesFilters): Promise<CourseListResponse> {
  const params = new URLSearchParams();
  if (filters.level) params.set("level", String(filters.level));
  if (filters.term) params.set("term", String(filters.term));
  if (filters.isPractical !== undefined) params.set("isPractical", String(filters.isPractical));
  if (filters.search) params.set("search", filters.search);
  params.set("page", String(filters.page ?? 1));
  params.set("pageSize", String(filters.pageSize ?? 12));

  return apiFetch<CourseListResponse>(`/courses?${params.toString()}`, false);
}

/** Fetch course by id (throws notFound on 404/422) */
export function getCourse(id: string): Promise<CourseDetail> {
  return apiFetch<CourseDetail>(`/courses/${id}`, false, true);
}

export { API_URL, ApiError };
