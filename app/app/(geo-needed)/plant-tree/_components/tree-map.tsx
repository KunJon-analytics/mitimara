"use client";

import Map from "react-map-gl/maplibre";

import { env } from "@/env.mjs";
import UserMarker from "../../_components/user-marker";
import TreeMarker from "../../_components/tree-marker";

type TreeMapProps = {
  latitude: number;
  longitude: number;
  userLocation?: { latitude: number; longitude: number };
};

const TreeMap = ({ latitude, longitude, userLocation }: TreeMapProps) => {
  return (
    <Map
      initialViewState={{
        latitude,
        longitude,
        zoom: 14,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${env.NEXT_PUBLIC_MAPTILER_TOKEN}`}
    >
      {userLocation && <UserMarker userLocation={userLocation} />}

      <TreeMarker tree={{ latitude, longitude }} />
    </Map>
  );
};

export default TreeMap;
