"use client";

import { Marker } from "react-map-gl/maplibre";
import { Dispatch, SetStateAction } from "react";
import { TreePalm } from "lucide-react";

import { TreeData } from "../services";
import { getTreeMarkerColor, getTreeMarkerStatus, PopupInfo } from "../utils";

type TreeMarkerWithPopupProps = {
  tree: TreeData & {
    distance?: number;
  };
  setPopupInfo: Dispatch<SetStateAction<PopupInfo | null>>;
};

const TreeMarkerWithPopup = ({
  tree,
  setPopupInfo,
}: TreeMarkerWithPopupProps) => {
  const markerColor = getTreeMarkerColor(getTreeMarkerStatus(tree));

  return (
    <Marker
      key={tree.id}
      latitude={tree.latitude}
      longitude={tree.longitude}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        setPopupInfo({
          tree,
          latitude: tree.latitude,
          longitude: tree.longitude,
        });
      }}
    >
      <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform">
        <div
          className="p-2 rounded-full shadow-lg text-white"
          style={{
            backgroundColor: markerColor,
          }}
        >
          <TreePalm className="h-4 w-4" />
        </div>
        <div
          className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent"
          style={{
            borderTopColor: markerColor,
          }}
        ></div>
      </div>
    </Marker>
  );
};

export default TreeMarkerWithPopup;
