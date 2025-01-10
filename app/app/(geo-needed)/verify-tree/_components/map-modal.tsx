"use client";

import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { NearbyTreeReturnType } from "@/lib/validations/tree";
import TreeMap from "../../plant-tree/_components/tree-map";
import { calculateDistance } from "@/lib/utils";

type MapModalProps = {
  nearbyTree: NearbyTreeReturnType;
  userLocation: { latitude: number; longitude: number };
};

export function MapModal({ nearbyTree, userLocation }: MapModalProps) {
  if (!nearbyTree) {
    return null;
  }

  const { latitude, longitude } = nearbyTree;

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button variant="ghost" size="icon">
          <MapPin className="h-4 w-4 animate-pulse text-primary" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="p-4">
        <CredenzaHeader>
          <CredenzaTitle>Tree Location</CredenzaTitle>
          <CredenzaDescription>
            This is the location where the tree was planted.
          </CredenzaDescription>
        </CredenzaHeader>
        <div className="h-[300px] w-full rounded-md overflow-hidden">
          <TreeMap
            latitude={latitude}
            longitude={longitude}
            userLocation={userLocation}
          />
        </div>
        <p className="text-center text-sm mt-2">
          Your location is in{" "}
          <span className="text-purple-700 dark:text-purple-500">purple</span>,
          tree location is in <span className="text-primary">green</span>.
        </p>
        <p className="text-center mt-2">
          You are{" "}
          {calculateDistance(
            latitude,
            longitude,
            userLocation.latitude,
            userLocation.longitude
          )}{" "}
          km away from the tree
        </p>
      </CredenzaContent>
    </Credenza>
  );
}
