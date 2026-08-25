import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import Link from "next/link";
import { type ReactNode, Suspense } from "react";

import { CourseCard } from "@/components/course-card";
import { CourseGridSkeleton } from "@/components/course-grid-skeleton";
import { CoursesToolbar } from "@/components/courses-toolbar";
import { EmptyState } from "@/components/empty-state";
import { ApiError, getCourses } from "@/lib/api";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

export const metadata = { title: "الكورسات — مشكاة" };

export default async function CoursesPage({ searchParams }: PageProps<"/courses">) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-2xl text-foreground sm:text-3xl">الكورسات</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">ابحث وصفّي المواد حسب المستوى والفصل ونوع الكورس</p>
      </div>

      <div className="mb-8">
        <CoursesToolbar />
      </div>

      <Suspense key={JSON.stringify(params)} fallback={<CourseGridSkeleton />}>
        <CoursesResults searchParams={params} />
      </Suspense>
    </div>
  );
}

async function CoursesResults({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const first = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const page = Number(first("page")) || 1;
  const filters = {
    level: first("level") ? Number(first("level")) : undefined,
    term: first("term") ? Number(first("term")) : undefined,
    isPractical: first("isPractical") ? first("isPractical") === "true" : undefined,
    search: first("search") || undefined,
    page,
    pageSize: PAGE_SIZE,
  };

  let data;
  try {
    data = await getCourses(filters);
  } catch (error) {
    return (
      <EmptyState
        icon={SearchX}
        title="تعذّر تحميل الكورسات"
        description={error instanceof ApiError ? error.message : "حدث خطأ غير متوقع، حاول تحديث الصفحة."}
      />
    );
  }

  if (data.items.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="لا توجد نتائج مطابقة"
        description="جرّب تعديل كلمة البحث أو مسح الفلاتر المطبّقة."
      />
    );
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));

  return (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-muted-foreground">
        {data.total} كورس · صفحة {data.page} من {totalPages}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((course) => <CourseCard key={course.id} course={course} />)}
      </div>

      {totalPages > 1 && <Pagination page={data.page} totalPages={totalPages} searchParams={searchParams} />}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  // Preserves the other filters (search/level/term) when changing page
  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (key === "page" || !value) continue;
      params.set(key, Array.isArray(value) ? value[0]! : value);
    }
    if (p > 1) params.set("page", String(p));
    const query = params.toString();
    return query ? `/courses?${query}` : "/courses";
  };

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="ترقيم الصفحات">
      <PageLink href={pageHref(page - 1)} disabled={page <= 1} label="السابق">
        <ChevronRight className="size-4" />
      </PageLink>

      <span className="px-3 text-sm text-muted-foreground">
        {page} / {totalPages}
      </span>

      <PageLink href={pageHref(page + 1)} disabled={page >= totalPages} label="التالي">
        <ChevronLeft className="size-4" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: ReactNode;
}) {
  if (disabled) {
    return (
      <span className="flex size-9 items-center justify-center rounded-lg text-muted-foreground/40">{children}</span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "flex size-9 items-center justify-center rounded-lg border border-border text-foreground",
        "transition-colors hover:border-primary/40 hover:bg-accent",
      )}
    >
      {children}
    </Link>
  );
}
