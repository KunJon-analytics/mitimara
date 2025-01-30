"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetBountyHuntDetail } from "@/lib/validations/local-bounty/service";
import useCurrentLocation from "@/components/providers/location-provider";
import { MapWithRadius } from "../../_components/map-with-radius";
import DistanceText from "./distance-text";

type LocationTabProps = {
  bountyHunt: GetBountyHuntDetail;
};

export function LocationTab({ bountyHunt }: LocationTabProps) {
  const {
    state: { latitude, longitude },
  } = useCurrentLocation();
  const userFound = latitude !== null && longitude !== null;
  const user = userFound ? { lat: latitude, lng: longitude } : undefined;

  if (!bountyHunt) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent>
        <MapWithRadius
          className="w-full relative"
          center={{
            lat: bountyHunt.centerLatitude,
            lng: bountyHunt.centerLongitude,
          }}
          radius={bountyHunt.radius}
          user={user}
        />
        <div className="mt-4 space-y-2">
          {user && (
            <DistanceText
              params={{
                eventLat: bountyHunt.centerLatitude,
                eventLng: bountyHunt.centerLongitude,
                eventRadius: bountyHunt.radius,
                userLat: user.lat,
                userLng: user.lng,
              }}
            />
          )}
          <p>
            <strong>Center:</strong> {bountyHunt.centerLatitude.toFixed(6)},{" "}
            {bountyHunt.centerLongitude.toFixed(6)}{" "}
          </p>
          {bountyHunt.location && (
            <p className="text-xs text-muted-foreground">
              {bountyHunt.location}
            </p>
          )}
          <p>
            <strong>Radius:</strong> {bountyHunt.radius} km
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
