import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TreesPageSkeleton() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header skeleton */}
      <div className="flex-shrink-0 bg-background border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24 mt-1" />
          </div>
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      {/* Map skeleton - takes remaining space */}
      <div className="flex-1 relative">
        <Skeleton className="w-full h-full" />

        {/* Legend skeleton */}
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="bg-background/95 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-1">
                    <Skeleton className="w-3 h-3 rounded-full" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
