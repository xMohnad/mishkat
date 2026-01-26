import { FileSearch } from "lucide-react";

export function NoResults() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
        <FileSearch className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-slate-900 dark:text-slate-100 font-semibold text-lg mb-1">
        لا توجد نتائج مطابقة
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-xs">
        حاول تغيير كلمات البحث أو الفلاتر للعثور على ما تبحث عنه.
      </p>
    </div>
  );
}
