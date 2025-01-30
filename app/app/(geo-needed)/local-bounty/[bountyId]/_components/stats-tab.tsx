import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetBountyHuntDetail } from "@/lib/validations/local-bounty/service";

import { Trees, Users, Coins, CheckCircle } from "lucide-react";

type StatsTabProps = {
  bountyHunt: GetBountyHuntDetail;
};

export function StatsTab({ bountyHunt }: StatsTabProps) {
  if (!bountyHunt) {
    return null;
  }
  const totalTrees = bountyHunt.trees.length;
  const totalParticipants = bountyHunt._count.participantRewards;
  const verifiedTrees = bountyHunt.trees.filter(
    (tree) => tree.isAuthentic
  ).length;

  return (
    <div className="grid gap-4 grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Trees</CardTitle>
          <Trees className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTrees}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Participants</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalParticipants}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bounty</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bountyHunt.totalBounty} Pi</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Verified Trees</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{verifiedTrees}</div>
        </CardContent>
      </Card>
    </div>
  );
}
