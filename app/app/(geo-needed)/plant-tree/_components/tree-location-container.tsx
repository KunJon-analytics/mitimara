"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import useCurrentLocation from "@/components/providers/location-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { BountyHuntModalParam } from "@/lib/validations/local-bounty/service";
import LocationErrorCard from "../../_components/location-error-card";
import TreeMap from "./tree-map";
import { MapWithRadius } from "../../local-bounty/_components/map-with-radius";
import DistanceText from "../../local-bounty/[bountyId]/_components/distance-text";

type TreeLocationContainerProps = { localBounty?: BountyHuntModalParam };

const TreeLocationContainer = ({ localBounty }: TreeLocationContainerProps) => {
  const {
    state: { latitude, longitude, error, loading },
  } = useCurrentLocation();
  const router = useRouter();

  useEffect(() => {
    let toastId: number | string;

    if (localBounty) {
      toastId = toast.info(`Here to verify trees?`, {
        description: `Visit the 'verify tree' page for tree verification!`,
        action: {
          label: "Verify Trees",
          onClick: () => router.push("/app/verify-tree"),
        },
      });
    }

    return () => {
      toast.dismiss(toastId);
    };
  }, [localBounty, router]);

  if (loading) {
    return (
      <LocationErrorCard
        error="Loading... (you may need to enable permissions)"
        className="w-full h-64 md:w-96 rounded-lg overflow-hidden"
      />
    );
  }

  if (error) {
    return (
      <LocationErrorCard
        error={error.message}
        className="w-full h-64 md:w-96 rounded-lg overflow-hidden"
      />
    );
  }

  if (latitude === null || longitude === null) {
    return (
      <Skeleton className="w-full h-64 md:w-96 rounded-lg overflow-hidden" />
    );
  }

  if (localBounty) {
    return (
      <>
        <MapWithRadius
          className="w-full relative"
          center={{
            lat: localBounty.centerLatitude,
            lng: localBounty.centerLongitude,
          }}
          radius={localBounty.radius}
          user={{ lat: latitude, lng: longitude }}
        />
        <div className="mt-4 space-y-2">
          <DistanceText
            params={{
              eventLat: localBounty.centerLatitude,
              eventLng: localBounty.centerLongitude,
              eventRadius: localBounty.radius,
              userLat: latitude,
              userLng: longitude,
            }}
          />

          <p>
            <strong>Center:</strong> {localBounty.centerLatitude.toFixed(6)},{" "}
            {localBounty.centerLongitude.toFixed(6)}{" "}
          </p>
          {localBounty.location && (
            <p className="text-xs text-muted-foreground">
              {localBounty.location}
            </p>
          )}
          <p>
            <strong>Radius:</strong> {localBounty.radius} km
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="w-full h-64 md:w-96 rounded-lg overflow-hidden">
      <TreeMap latitude={latitude} longitude={longitude} />
    </div>
  );
};

export default TreeLocationContainer;
