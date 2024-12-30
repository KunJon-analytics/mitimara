"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Map, { Marker } from "react-map-gl/maplibre";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { env } from "@/env.mjs";
import { createTree } from "@/actions/tree/create-tree";

const location = { longitude: -122.4, latitude: 37.8 };

export default function PlantTree() {
  const router = useRouter();
  const { latitude, longitude } = location;
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);

    // TODO: Replace 'user-id' with actual user ID from authentication
    const result = await createTree(latitude, longitude, "user-id");
    setIsConfirming(false);

    if (result.success) {
      router.push(`/tree/${result.treeId}`);
    } else {
      // TODO: Handle error (e.g., show error message to user)
      console.error(result.error);
    }
  };

  if (!latitude || !longitude) {
    return <div className="text-center p-4">Loading your location...</div>;
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h1 className="text-2xl font-bold">Plant a Tree</h1>
      <div className="w-full h-64 sm:h-96 rounded-lg overflow-hidden">
        <Map
          initialViewState={{
            latitude,
            longitude,
            zoom: 14,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${env.NEXT_PUBLIC_MAPTILER_TOKEN}`}
          //  mapStyle= 'https://demotiles.maplibre.org/style.json' dmeo
          // mapStyle="mapbox://styles/mapbox/streets-v11" mapbox
          // mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
        >
          <Marker latitude={latitude} longitude={longitude} color="red" />
        </Map>
      </div>
      <p className="text-center">
        Is this the exact location where you planted the tree?
      </p>
      <Button
        // onClick={handleConfirm}
        disabled={isConfirming}
        className="w-full sm:w-auto"
      >
        {isConfirming ? "Confirming..." : "Confirm Tree Location"}
      </Button>
      <div>
        <Button asChild>
          <Link href="/app">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
