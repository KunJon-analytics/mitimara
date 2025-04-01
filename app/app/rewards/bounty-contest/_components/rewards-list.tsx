"use client";

import useCurrentSession from "@/components/providers/session-provider";
import useProfile from "@/hooks/queries/use-profile";
import { RewardItem } from "./reward-item";
import { RewardsListSkeleton } from "./reward-list-skeleton";

export function RewardsList() {
  const { session, isPending } = useCurrentSession();
  const { data, isLoading } = useProfile(session.id);

  if (!session.isLoggedIn) {
    return (
      <p className="text-center text-muted-foreground">
        Please log in to see your unclaimed rewards.
      </p>
    );
  }

  if (isLoading || isPending) {
    return <RewardsListSkeleton />;
  }

  if (!data || data.bountyRewards.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No unclaimed rewards found.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.bountyRewards.map((reward) => (
        <RewardItem
          key={reward.id}
          id={reward.id}
          bountyTitle={reward.localBounty.title}
          treesPlanted={reward.treesPlanted}
          treesVerified={reward.treesVerified}
        />
      ))}
    </div>
  );
}
