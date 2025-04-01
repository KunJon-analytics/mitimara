import Link from "next/link";
import { TreesIcon as Tree, CheckCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RewardItemProps = {
  id: string;
  bountyTitle: string;
  treesPlanted: number;
  treesVerified: number;
};

export function RewardItem({
  id,
  bountyTitle,
  treesPlanted,
  treesVerified,
}: RewardItemProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{bountyTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Tree className="h-4 w-4 text-green-600" />
            <span className="text-sm">{treesPlanted} trees</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              {treesVerified} verifications
            </span>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </div>
        </div>
        <Link
          href={`/app/rewards/bounty-contest/${id}`}
          className="mt-2 text-sm text-blue-500 hover:underline block"
        >
          View Details
        </Link>
      </CardContent>
    </Card>
  );
}
