import { Suspense } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getActiveBountyContests } from "@/lib/services/bounty-hunt";
import { BountyHuntsSkeleton } from "../_components/bounty-hunts-skeleton";
import { BountyHuntList } from "../_components/bounty-hunt-list";

export default function ActiveBountyHuntsPage() {
  const bountyHuntsPromise = getActiveBountyContests();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg sm:text-2xl font-bold">Active Bounty Hunts</h1>
        <Button asChild>
          <Link href="/app/local-bounty/create">
            <PlusCircle className="ml-2 h-4 w-4" />
            Create Bounty
          </Link>
        </Button>
      </div>
      <Suspense fallback={<BountyHuntsSkeleton />}>
        <BountyHuntList bountyHuntsPromise={bountyHuntsPromise} />
      </Suspense>
    </div>
  );
}
