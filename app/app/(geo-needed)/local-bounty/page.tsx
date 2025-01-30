import { Suspense } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { BountyHuntList } from "./_components/bounty-hunt-list";
import { BountyHuntsSkeleton } from "./_components/bounty-hunts-skeleton";

export default function BountyHuntsPage() {
  const bountyHuntsPromise = prisma.localBounty.findMany({
    where: { paymentId: { not: null }, endDate: { gte: new Date() } },
    select: {
      id: true,
      title: true,
      centerLatitude: true,
      centerLongitude: true,
      radius: true,
      startDate: true,
      endDate: true,
      totalBounty: true,
    },
  });
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg sm:text-2xl font-bold">Bounty Hunt Contests</h1>
        <Button asChild>
          <Link href="/app/local-bounty/create">
            <PlusCircle className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <Suspense fallback={<BountyHuntsSkeleton />}>
        <BountyHuntList bountyHuntsPromise={bountyHuntsPromise} />
      </Suspense>
    </div>
  );
}
