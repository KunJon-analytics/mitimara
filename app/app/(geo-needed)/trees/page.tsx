import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";

import TreesPageSkeleton from "./components/trees-page-skeleton";
import TreesContent from "./components/trees-content";
import { searchParamsCache } from "./searchParams";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function TreesPage({ searchParams }: PageProps) {
  await searchParamsCache.parse(searchParams);

  return (
    <div className="container mx-auto p-4 space-y-6 mb-16">
      <Suspense fallback={<TreesPageSkeleton />}>
        <TreesContent />
      </Suspense>
    </div>
  );
}
