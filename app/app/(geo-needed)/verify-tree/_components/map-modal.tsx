"use client";

import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NearbyTreeReturnType } from "@/lib/validations/tree";
import TreeMap from "../../plant-tree/_components/tree-map";

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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <MapPin className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tree Location</DialogTitle>
          <DialogDescription>
            This is the location where the tree was planted.
          </DialogDescription>
        </DialogHeader>
        <div className="h-[300px] w-full rounded-md overflow-hidden">
          <TreeMap
            latitude={latitude}
            longitude={longitude}
            userLocation={userLocation}
          />
        </div>
        <p className="text-center mt-2">
          <strong>Coordinates:</strong> {latitude.toFixed(6)},{" "}
          {longitude.toFixed(6)}
        </p>
      </DialogContent>
    </Dialog>
  );
}
