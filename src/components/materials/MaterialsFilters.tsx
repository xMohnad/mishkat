"use client";

import { RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search, Filter, BookOpen } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { IMaterialsFilters } from "@/lib/material-sctions";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  filters: IMaterialsFilters;
  selectedLevel?: number;
  selectedTerm?: number;
  searchQuery?: string;
  totalResults?: number;
  onChange: (level?: number, term?: number, q?: string) => void;
}

interface FilterSelectProps {
  value?: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: number; label: string }[];
}


function FilterSelect({ value, onChange, placeholder, options }: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-11 w-full bg-background/50 flex-row-reverse">
        <div className="flex items-center gap-2 truncate flex-row-reverse">
          <Filter className="w-4 h-4 text-muted-foreground opacity-70" />
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>

      <SelectContent position="popper" className="bg-card border border-border rounded-md shadow-lg min-w-[180px] ">
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value.toString()}
            className="
              px-3 py-2
              cursor-pointer
              select-none
              rounded-md
              hover:bg-primary/10
              data-[highlighted]:bg-primary/20
              data-[state=checked]:bg-primary/20
              data-[state=checked]:text-primary
              text-foreground
            "
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
export default function MaterialsFilters({
  filters,
  selectedLevel,
  selectedTerm,
  searchQuery,
  totalResults = 0,
  onChange,
}: Props) {


  const [localQuery, setLocalQuery] = useState(searchQuery ?? "");

  useEffect(() => {
    setLocalQuery(searchQuery ?? "");
  }, [searchQuery]);

  useEffect(() => {
    const id = setTimeout(() => {
      onChange(selectedLevel, selectedTerm, localQuery);
    }, 400);
    return () => clearTimeout(id);
  }, [localQuery]);

  const clearFilters = () => {
    setLocalQuery("");
    onChange(undefined, undefined, "");
  };

  useEffect(() => {
    setLocalQuery(searchQuery ?? "");
  }, [searchQuery]);

  useEffect(() => {
    const id = setTimeout(() => {
      onChange(selectedLevel, selectedTerm, localQuery);
    });

    return () => clearTimeout(id);
  }, [localQuery]);

  return (
    <div className="grid gap-8 p-4">
      <div className="bg-card border rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* Search Input */}
          <div className="md:col-span-6 lg:col-span-6 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="ابحث باسم المادة، الملف..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="pr-9 h-11 bg-background/50 focus:bg-background transition-colors"
            />
          </div>

          {/* Level Select */}
          <div className="md:col-span-3 lg:col-span-3">
            <FilterSelect
              value={selectedLevel?.toString()}
              onChange={(v) => onChange(Number(v), selectedTerm, localQuery)}
              placeholder="المستوى الدراسي"
              options={filters.levels}
            />
          </div>

          <div className="md:col-span-3 lg:col-span-3">
            <FilterSelect
              value={selectedTerm?.toString()}
              onChange={(v) => onChange(selectedLevel, Number(v), localQuery)}
              placeholder="الفصل الدراسي"
              options={filters.terms}
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-nowrap">
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFilters}
              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            <BookOpen className="w-4 h-4 flex-shrink-0" />

            <span className="whitespace-nowrap">تم العثور على</span>

            <Badge
              variant="secondary"
              className="px-2 py-0.5 text-primary bg-primary/10 flex-shrink-0"
            >
              {totalResults}
            </Badge>

            <span className="whitespace-nowrap">مادة</span>
          </div>

        </div>
      </div>
    </div>
  );
}

