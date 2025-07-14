"use client";

import { Dispatch, SetStateAction } from "react";
import { Popup } from "react-map-gl/maplibre";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  canVerifyTree,
  getStatusBadgeVariant,
  getTreeMarkerStatus,
  type PopupInfo,
} from "../utils";

type TreePopupProps = {
  popupInfo: PopupInfo;
  setPopupInfo: Dispatch<SetStateAction<PopupInfo | null>>;
};

const TreePopup = ({ popupInfo, setPopupInfo }: TreePopupProps) => {
  const treeMarkerStatus = getTreeMarkerStatus(popupInfo.tree);

  return (
    <Popup
      latitude={popupInfo.latitude}
      longitude={popupInfo.longitude}
      anchor="top"
      onClose={() => setPopupInfo(null)}
      closeButton={true}
      closeOnClick={false}
      className="text-black"
    >
      <div className="p-3 space-y-3 bg-card text-card-foreground">
        <div className="flex items-center gap-2 justify-between">
          <h3 className="font-semibold">Tree #{popupInfo.tree.id.slice(-6)}</h3>
          <Badge
            variant={getStatusBadgeVariant(treeMarkerStatus)}
            className="uppercase"
          >
            {treeMarkerStatus}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Planted by:</strong> {popupInfo.tree.planter.username}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {popupInfo.tree.createdAt.toLocaleDateString()}
          </p>
          {popupInfo.tree.distance !== undefined && (
            <p>
              <strong>Distance:</strong> {popupInfo.tree.distance.toFixed(2)} km
              away
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full bg-transparent"
          >
            <Link href={`/app/tree/${popupInfo.tree.id}`}>View Details</Link>
          </Button>

          {canVerifyTree({
            status: treeMarkerStatus,
            distance: popupInfo.tree.distance,
          }) && (
            <Button asChild size="sm" className="w-full">
              <Link href="/app/verify-tree">Verify Tree</Link>
            </Button>
          )}
        </div>
      </div>
    </Popup>
  );
};

export default TreePopup;
