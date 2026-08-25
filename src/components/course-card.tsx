import { FileStack, GraduationCap, UserRound } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { type CourseSummary, levelLabel, termLabel } from "@/lib/types";

function CourseCard({ course }: { course: CourseSummary }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className={"group flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-all "
        + "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg leading-snug text-foreground">{course.courseName}</h3>
        <Badge variant={course.isPractical ? "primary" : "outline"} className="shrink-0">
          {course.isPractical ? "عملي" : "نظري"}
        </Badge>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <UserRound className="size-3.5 shrink-0" />
        <span className="truncate">{course.tutorName}</span>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <GraduationCap className="size-3.5" />
          {levelLabel(course.level)} · {termLabel(course.term)}
        </div>
        <div className="flex items-center gap-1.5">
          <FileStack className="size-3.5" />
          {course.fileCount} ملف
        </div>
      </div>
    </Link>
  );
}

export { CourseCard };
