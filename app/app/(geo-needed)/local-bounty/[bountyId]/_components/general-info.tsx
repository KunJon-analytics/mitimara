import { Calendar, Coins, MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GetBountyHuntDetail } from "@/lib/validations/local-bounty/service";

type GeneralInfoProps = { localHunt: GetBountyHuntDetail };

export function GeneralInfo({ localHunt }: GeneralInfoProps) {
  if (!localHunt) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            {localHunt.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{localHunt.description}</p>

        <Separator />

        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Location</p>
            <p className="text-xs text-muted-foreground">
              {localHunt.centerLatitude.toFixed(6)},{" "}
              {localHunt.centerLongitude.toFixed(6)}
            </p>
            <p className="text-xs text-muted-foreground">
              Radius: {localHunt.radius} km
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Duration</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(localHunt.startDate, { addSuffix: true })} -{" "}
              {formatDistanceToNow(localHunt.endDate, { addSuffix: true })}
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coins className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Total Bounty</p>
          </div>
          <p className="text-lg font-bold">π{localHunt.totalBounty}</p>
        </div>
      </CardContent>
    </Card>
  );
}
