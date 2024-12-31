"use client";

import Map, { Marker } from "react-map-gl/maplibre";
import { env } from "@/env.mjs";

type TreeMapProps = { latitude: string; longitude: string };

const TreeMap = ({ latitude, longitude }: TreeMapProps) => {
  const latitudeNumber = parseFloat(latitude);
  const longitudeNumber = parseFloat(longitude);

  return (
    <Map
      initialViewState={{
        latitude: latitudeNumber,
        longitude: longitudeNumber,
        zoom: 14,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${env.NEXT_PUBLIC_MAPTILER_TOKEN}`}
    >
      <Marker
        latitude={latitudeNumber}
        longitude={longitudeNumber}
        color="green"
      />
    </Map>
  );
};

export default TreeMap;
