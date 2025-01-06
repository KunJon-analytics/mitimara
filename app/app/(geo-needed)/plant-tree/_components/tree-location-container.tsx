"use client";

import React from "react";

import useCurrentLocation from "@/components/providers/location-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { defaultUserLocation } from "@/lib/validations/location";
import LocationErrorCard from "../../_components/location-error-card";
import TreeMap from "./tree-map";

const TreeLocationContainer = () => {
  const {
    error,
    loading,
    location: { latitude, longitude },
  } = useCurrentLocation();

  if (loading) {
    return (
      <Skeleton className="w-full h-64 sm:h-96 rounded-lg overflow-hidden" />
    );
  }

  if (error) {
    return (
      <LocationErrorCard
        error={error}
        className="w-full h-64 sm:h-96 rounded-lg overflow-hidden"
      />
    );
  }

  return (
    <div className="w-full h-64 sm:h-96 rounded-lg overflow-hidden">
      <TreeMap
        latitude={latitude === null ? defaultUserLocation.latitude : latitude}
        longitude={
          longitude === null ? defaultUserLocation.longitude : longitude
        }
      />
    </div>
  );
};

export default TreeLocationContainer;
