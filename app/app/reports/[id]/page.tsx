import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { ReportDetailContent } from "./_components/report-detail-content";

type Params = Promise<{ id: string }>;

export default function ReportDetailPage({ params }: { params: Params }) {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Suspense fallback={<ReportDetailSkeleton />}>
        <ReportDetailContent params={params} />
      </Suspense>
    </div>
  );
}

function ReportDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
        <Skeleton className="h-6 w-24 self-start sm:self-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>

      <Skeleton className="h-64" />
      <Skeleton className="h-96" />
    </div>
  );
}
