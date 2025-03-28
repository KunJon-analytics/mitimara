import { Suspense } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TreeReportContent } from "./_components/tree-report-content";

type Params = Promise<{ id: string }>;

export default async function TreeReportPage(props: { params: Params }) {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Report Tree</h1>
      <Suspense fallback={<TreeReportSkeleton />}>
        <TreeReportContent params={props.params} />
      </Suspense>
    </div>
  );
}

function TreeReportSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-4 w-2/3 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}
