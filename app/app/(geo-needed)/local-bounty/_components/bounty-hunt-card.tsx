import Link from "next/link";
import { MapPin, Calendar, Coins } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type BountyHunt = {
  id: string;
  title: string;
  centerLatitude: number;
  centerLongitude: number;
  radius: number;
  startDate: Date;
  endDate: Date;
  totalBounty: number;
};

export function BountyHuntCard({ bounty }: { bounty: BountyHunt }) {
  return (
    <Link href={`/app/local-bounty/${bounty.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardContent className="p-4 space-y-2">
          <h2 className="text-lg font-semibold line-clamp-1">{bounty.title}</h2>

          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Location</p>
              <p className="text-xs text-muted-foreground">
                {bounty.centerLatitude.toFixed(6)},{" "}
                {bounty.centerLongitude.toFixed(6)}
              </p>
              <p className="text-xs text-muted-foreground">
                Radius: {bounty.radius} km
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Duration</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(bounty.startDate, { addSuffix: true })} -{" "}
                {formatDistanceToNow(bounty.endDate, { addSuffix: true })}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <Badge variant="secondary" className="flex items-center">
            <Coins className="mr-1 h-4 w-4" />
            {bounty.totalBounty} Pi
          </Badge>
          <span className="text-sm text-muted-foreground">
            {Math.ceil(
              (new Date(bounty.endDate).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            days left
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
