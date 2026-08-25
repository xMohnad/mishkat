import { ArrowRight, FileStack, GraduationCap, UserRound } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { CourseFileRow } from "@/components/course-file-row";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError, getCourse } from "@/lib/api";
import { levelLabel, termLabel } from "@/lib/types";

export default async function CourseDetailPage({ params }: PageProps<"/courses/[id]">) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link
        href="/courses"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowRight className="size-4" />
        الكورسات
      </Link>

      <Suspense fallback={<CourseDetailSkeleton />}>
        <CourseDetailContent id={id} />
      </Suspense>
    </div>
  );
}

async function CourseDetailContent({ id }: { id: string }) {
  let course;
  try {
    course = await getCourse(id);
  } catch (error) {
    // Re-throw non-API errors (e.g. Next.js notFound)
    if (!(error instanceof ApiError)) throw error;

    return <EmptyState icon={FileStack} title="تعذّر تحميل الكورس" description={error.message} />;
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-display text-2xl text-foreground sm:text-3xl">{course.courseName}</h1>
          <Badge variant={course.isPractical ? "primary" : "outline"} className="shrink-0">
            {course.isPractical ? "عملي" : "نظري"}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <UserRound className="size-4" />
            {course.tutorName}
          </span>
          <span className="flex items-center gap-1.5">
            <GraduationCap className="size-4" />
            {levelLabel(course.level)} · {termLabel(course.term)}
          </span>
          <span className="flex items-center gap-1.5">
            <FileStack className="size-4" />
            {course.fileCount} ملف
          </span>
        </div>
      </header>

      <section>
        <h2 className="mb-4 font-display text-lg text-foreground">الملفات</h2>

        {course.files.length === 0
          ? (
            <EmptyState
              icon={FileStack}
              title="لا توجد ملفات بعد"
              description="لم تتم إضافة أي ملفات لهذا الكورس حتى الآن."
            />
          )
          : (
            <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {course.files.map((file) => <CourseFileRow key={file.id} file={file} />)}
            </ul>
          )}
      </section>
    </div>
  );
}

function CourseDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <Skeleton className="h-32 rounded-xl" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
    </div>
  );
}
