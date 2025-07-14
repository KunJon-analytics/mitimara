"use client";

import { Marker } from "react-map-gl/maplibre";
import { TreePalm } from "lucide-react";

type TreeMarkerProps = {
  tree: {
    latitude: number;
    longitude: number;
  };
};

const TreeMarker = ({ tree }: TreeMarkerProps) => {
  return (
    <Marker latitude={tree.latitude} longitude={tree.longitude} anchor="bottom">
      <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform">
        <div
          className="p-2 rounded-full shadow-lg text-white"
          style={{
            backgroundColor: "#22c55e",
          }}
        >
          <TreePalm className="h-4 w-4" />
        </div>
        <div
          className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent"
          style={{
            borderTopColor: "#22c55e",
          }}
        ></div>
      </div>
    </Marker>
  );
};

export default TreeMarker;
