"use client";

import React from "react";

import useCurrentLocation from "@/components/providers/location-provider";
import { Skeleton } from "@/components/ui/skeleton";
import LocationErrorCard from "../../_components/location-error-card";
import TreeMap from "./tree-map";

const TreeLocationContainer = () => {
  const {
    state: { latitude, longitude, error, loading },
  } = useCurrentLocation();

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

  return (
    <div className="w-full h-64 md:w-96 rounded-lg overflow-hidden">
      <TreeMap latitude={latitude} longitude={longitude} />
    </div>
  );
};

export default TreeLocationContainer;
