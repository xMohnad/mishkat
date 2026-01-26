"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MaterialsListSkeleton from "@/components/materials/MaterialsListSkeleton";
import {
  getGroupedMaterials,
  getMaterialsFilters,
  IGroupedMaterials,
  IMaterialsFilters,
} from "@/lib/material-sctions";
import MaterialsFilters from "@/components/materials/MaterialsFilters";
import { NoResults } from "@/components/materials/NoResults";
import { MaterialsFiltersSkeleton } from "@/components/materials/MaterialsFiltersSkeleton";


const MaterialsList = lazy(() => import("@/components/materials/MaterialsList"));

export default function MaterialsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [materials, setMaterials] = useState<IGroupedMaterials[]>([]);
  const [filters, setFilters] = useState<IMaterialsFilters | null>(null);
  const [loading, setLoading] = useState(true);

  const level = Number(searchParams.get("level")) || undefined;
  const term = Number(searchParams.get("term")) || undefined;
  const q = searchParams.get("q") ?? "";

  useEffect(() => {
    const init = async () => {
      const f = await getMaterialsFilters();
      setFilters(f);

      if (!level || !term) {
        const defaultLevel = Math.max(...f.levels.map(l => l.value));
        const defaultTerm = Math.max(...f.terms.map(t => t.value));
        router.replace(`?level=${defaultLevel}&term=${defaultTerm}`);
        return;
      }

      const data = await getGroupedMaterials({ level, term, q } as any);
      setMaterials(data);
      setLoading(false);
    };

    init();
  }, [level, term, q]);

  const handleFilterChange = (lvl?: number, trm?: number, query?: string) => {
    const params = new URLSearchParams();
    lvl && params.set("level", lvl.toString());
    trm && params.set("term", trm.toString());
    query && params.set("q", query);

    router.push(`?${params.toString()}`);
  };

  return (
    <>
      {/* Filters */}
      {loading || !filters ? (
        <MaterialsFiltersSkeleton />
      ) : (
        <MaterialsFilters
          filters={filters}
          selectedLevel={level}
          selectedTerm={term}
          searchQuery={q}
          totalResults={materials.length}
          onChange={handleFilterChange}
        />
      )}

      {/* Materials */}
      {loading ? (
        <MaterialsListSkeleton />
      ) : materials.length === 0 ? (
        <NoResults />
      ) : (
        <Suspense fallback={<MaterialsListSkeleton />}>
          <MaterialsList materials={materials} />
        </Suspense>
      )}
    </>
  );
}
