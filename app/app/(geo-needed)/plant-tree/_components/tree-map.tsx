"use client";

import Map, { Marker } from "react-map-gl/maplibre";

import { env } from "@/env.mjs";

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
      <Marker latitude={latitude} longitude={longitude} color="green" />
      {userLocation && (
        <Marker
          latitude={userLocation.latitude}
          longitude={userLocation.longitude}
          color="purple"
        />
      )}
    </Map>
  );
};

export default TreeMap;
