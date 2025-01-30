import { Skeleton } from "@/components/ui/skeleton";

export function SlidingBannerSkeleton() {
  return (
    <div className="bg-green-100 p-4 rounded-lg shadow-md overflow-hidden h-16">
      <Skeleton className="h-8 w-full" />
    </div>
  );
}
