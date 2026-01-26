import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const MaterialsListSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card
        key={i}
        className="relative overflow-hidden border-none shadow-md bg-white dark:bg-slate-900"
      >
        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800" />

        <CardHeader className="pb-4">
          <div className="flex justify-between items-start mb-4">
            {/* Badge Skeleton */}
            <Skeleton className="h-6 w-24 rounded-full" />
            {/* File count Skeleton */}
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          {/* Title Skeleton */}
          <Skeleton className="h-7 w-full mb-2" />
          <Skeleton className="h-7 w-2/3" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Teacher Info Card Skeleton */}
          <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Accordion Trigger Skeleton */}
          <div className="pt-2">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default MaterialsListSkeleton;

