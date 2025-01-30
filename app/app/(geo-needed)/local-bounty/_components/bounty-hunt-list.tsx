"use client";

import { use } from "react";

import { BountyHuntCard } from "./bounty-hunt-card";

type BountyHuntListParams = {
  bountyHuntsPromise: Promise<
    {
      id: string;
      title: string;
      totalBounty: number;
      radius: number;
      centerLatitude: number;
      centerLongitude: number;
      startDate: Date;
      endDate: Date;
    }[]
  >;
};

export function BountyHuntList({ bountyHuntsPromise }: BountyHuntListParams) {
  const bountyHunts = use(bountyHuntsPromise);

  if (bountyHunts.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No bounty hunt contests found.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {bountyHunts.map((bounty) => (
        <BountyHuntCard key={bounty.id} bounty={bounty} />
      ))}
    </div>
  );
}
