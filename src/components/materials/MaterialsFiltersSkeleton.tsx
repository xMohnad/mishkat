export function MaterialsFiltersSkeleton() {
  return (
    <div className="grid gap-8 p-4 animate-pulse">

      <div className="bg-card border rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* Search Input Skeleton */}
          <div className="md:col-span-6 lg:col-span-6 h-11 bg-slate-200 dark:bg-slate-800 rounded-xl" />

          {/* Level Select Skeleton */}
          <div className="md:col-span-3 lg:col-span-3 h-11 bg-slate-200 dark:bg-slate-800 rounded-xl" />

          {/* Term Select Skeleton */}
          <div className="md:col-span-3 lg:col-span-3 h-11 bg-slate-200 dark:bg-slate-800 rounded-xl" />

          {/* Results Badge & Buttons Skeleton */}
          <div className="md:col-span-12 flex items-center gap-2 mt-2">
            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-6 w-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-6 w-8 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-6 w-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>

        </div>
      </div>
    </div>
  );
}
