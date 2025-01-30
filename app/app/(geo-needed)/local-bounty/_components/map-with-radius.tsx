"use client";

import { useCallback, useMemo, useRef } from "react";
import circle from "@turf/circle";
import Map, { Source, Layer, Marker, MapRef } from "react-map-gl/maplibre";

import { env } from "@/env.mjs";
import { cn } from "@/lib/utils";
import ControlPanel, { MapPositions } from "./control-panel";

interface MapWithRadiusProps extends React.HTMLAttributes<HTMLDivElement> {
  center: { lat: number; lng: number };
  user?: { lat: number; lng: number };
  radius: number;
}

export function MapWithRadius({
  center,
  radius,
  user,
  className,
  ...props
}: MapWithRadiusProps) {
  const mapRef = useRef<MapRef | null>(null);

  const onSelectCity = useCallback(({ longitude, latitude }: MapPositions) => {
    mapRef.current?.flyTo({ center: [longitude, latitude], duration: 2000 });
  }, []);

  const circleData = useMemo(() => {
    const options = { steps: 64, units: "kilometers" as const };
    const myCircle = circle([center.lng, center.lat], radius, options);
    return myCircle;
  }, [center, radius]);

  return (
    <div
      className={cn("w-full h-64 rounded-lg overflow-hidden", className)}
      {...props}
    >
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: center.lng,
          latitude: center.lat,
          zoom: 14,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${env.NEXT_PUBLIC_MAPTILER_TOKEN}`}
      >
        <Source id="circle-source" type="geojson" data={circleData}>
          <Layer
            id="circle-layer"
            type="fill"
            paint={{
              "fill-color": "green",
              "fill-opacity": 0.3,
            }}
          />
          <Layer
            id="circle-layer-outline"
            type="line"
            source="circle-source"
            paint={{
              "line-color": "green",
              "line-width": 3,
            }}
          />
        </Source>
        {user && (
          <Marker latitude={user.lat} longitude={user.lng} color="purple" />
        )}
        <Marker latitude={center.lat} longitude={center.lng} color="green" />
      </Map>
      {user && (
        <ControlPanel
          onSelectCity={onSelectCity}
          cities={[
            { latitude: center.lat, longitude: center.lng, type: "hunt" },
            { latitude: user.lat, longitude: user.lng, type: "user" },
          ]}
        />
      )}
    </div>
  );
}
