import { Shell } from "@/components/common/shell";
import { Skeleton } from "@/components/ui/skeleton";

const StatsSkeleton = () => {
  return (
    <Shell>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-16">
        {[1, 2, 3].map((i) => (
          <div
            className="flex flex-col items-center gap-2"
            key={`stats-skeleton-${i}`}
          >
            <Skeleton className="w-[14px] h-6" />
            <Skeleton className="w-[96px] h-4" />
          </div>
        ))}
      </div>
    </Shell>
  );
};

export default StatsSkeleton;
