"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Map, { MapRef } from "react-map-gl/maplibre";

import { env } from "@/env.mjs";
import { useMapSearchParams } from "@/hooks/use-map-search-params";
import { TreeData } from "../services";
import { PopupInfo } from "../utils";
import TreeMarkerWithPopup from "./tree-marker-with-popup";
import TreePopup from "./tree-popup";
import UserMarker from "../../_components/user-marker";

type TreesMapProps = {
  trees: (TreeData & { distance?: number })[];
};

export function TreesMap({ trees }: TreesMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);

  const {
    searchParams: { latitude, longitude },
  } = useMapSearchParams();

  const userLocation = useMemo(() => {
    return latitude !== null && longitude !== null
      ? { latitude, longitude }
      : undefined;
  }, [latitude, longitude]);

  const hasTrees = trees.length > 0;

  // Set initial viewport
  const initialViewState = useMemo(() => {
    return {
      latitude: hasTrees ? trees[0].latitude : latitude ?? 0,
      longitude: hasTrees ? trees[0].longitude : longitude ?? 0,
      zoom: hasTrees ? 12 : 8,
    };
  }, [hasTrees, latitude, longitude, trees]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [initialViewState.longitude, initialViewState.latitude],
        zoom: 12,
        duration: 1000,
      });
    }
  }, [initialViewState.latitude, initialViewState.longitude]);

  return (
    <div className="h-72 w-full md:h-[600px] rounded-lg overflow-hidden border">
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${env.NEXT_PUBLIC_MAPTILER_TOKEN}`}
        onClick={() => setPopupInfo(null)}
      >
        {/* User location marker */}
        {userLocation && <UserMarker userLocation={userLocation} />}

        {/* Tree markers */}
        {trees.map((tree) => (
          <TreeMarkerWithPopup
            setPopupInfo={setPopupInfo}
            tree={tree}
            key={tree.id}
          />
        ))}

        {/* Popup */}
        {popupInfo && (
          <TreePopup popupInfo={popupInfo} setPopupInfo={setPopupInfo} />
        )}
      </Map>
    </div>
  );
}
