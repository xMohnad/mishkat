"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { LEVELS, TERMS } from "@/lib/types";

const PRACTICAL_OPTIONS = [
  { value: "", label: "كل الأنواع" },
  { value: "true", label: "عملي" },
  { value: "false", label: "نظري" },
];

function CoursesToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = React.useState(searchParams.get("search") ?? "");

  const hasFilters = searchParams.has("search") || searchParams.has("level") || searchParams.has("term")
    || searchParams.has("isPractical");

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  // Debounced search to avoid firing a request on every keystroke
  React.useEffect(() => {
    const current = searchParams.get("search") ?? "";
    if (searchValue === current) return;

    const timeout = setTimeout(() => updateParams({ search: searchValue || null }), 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="ابحث باسم المقرر أو الدكتور..."
          className="ps-10 pe-9"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => setSearchValue("")}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="مسح البحث"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 sm:w-auto sm:flex">
        <Select
          className="sm:w-40"
          value={searchParams.get("level") ?? ""}
          onChange={(e) => updateParams({ level: e.target.value || null })}
        >
          <option value="">كل المستويات</option>
          {LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </Select>

        <Select
          className="sm:w-36"
          value={searchParams.get("term") ?? ""}
          onChange={(e) => updateParams({ term: e.target.value || null })}
        >
          <option value="">كل الفصول</option>
          {TERMS.map((term) => (
            <option key={term.value} value={term.value}>
              {term.label}
            </option>
          ))}
        </Select>

        <Select
          className="sm:w-36"
          value={searchParams.get("isPractical") ?? ""}
          onChange={(e) => updateParams({ isPractical: e.target.value || null })}
        >
          {PRACTICAL_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => {
            setSearchValue("");
            router.push(pathname);
          }}
        >
          <X className="size-4" />
          مسح الفلاتر
        </Button>
      )}
    </div>
  );
}

export { CoursesToolbar };
