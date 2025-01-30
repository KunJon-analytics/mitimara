import { Suspense } from "react";

import { RewardsList } from "./_components/rewards-list";
import { RewardsListSkeleton } from "./_components/reward-list-skeleton";

export default function RewardsPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Unclaimed Rewards</h1>
      <Suspense fallback={<RewardsListSkeleton />}>
        <RewardsList />
      </Suspense>
    </div>
  );
}
