import { ArrowLeft, LibraryBig } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { CourseCard } from "@/components/course-card";
import { CourseGridSkeleton } from "@/components/course-grid-skeleton";
import { EmptyState } from "@/components/empty-state";
import { NicheMark } from "@/components/niche-mark";
import { Button } from "@/components/ui/button";
import { ApiError, getCurrentCourses } from "@/lib/api";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-foreground sm:text-3xl">مقررات هذا الفصل</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">أحدث مقررات هذا الفصل الدراسي</p>
          </div>
          <Button asChild variant="ghost" className="hidden shrink-0 sm:inline-flex">
            <Link href="/courses">
              كل المقررات
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        </div>

        <Suspense fallback={<CourseGridSkeleton />}>
          <CurrentCourses />
        </Suspense>
      </section>
    </>
  );
}

async function CurrentCourses() {
  let courses;
  try {
    courses = await getCurrentCourses();
  } catch (error) {
    return (
      <EmptyState
        icon={LibraryBig}
        title="تعذّر تحميل المقررات"
        description={error instanceof ApiError ? error.message : "حدث خطأ غير متوقع، حاول تحديث الصفحة."}
      />
    );
  }

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={LibraryBig}
        title="لا توجد مقررات لهذا الفصل بعد"
        description="بمجرد إضافة مقررات اهذا الفصل، ستظهر هنا مباشرة."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => <CourseCard key={course.id} course={course} />)}
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/70">
      <div className="niche-glow absolute inset-x-0 -top-24 h-[28rem]" aria-hidden="true" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6 sm:py-32">
        <NicheMark className="size-14" />

        <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">مشكاة</h1>

        <p className="max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
          مكتبة مقررات الدفعة في مكان واحد.
        </p>

        <Button asChild size="lg">
          <Link href="/courses">
            تصفح كل المقررات
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
