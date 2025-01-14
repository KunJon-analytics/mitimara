"use client";

import { type Security } from "filestack-js";

import { NearbyTreeReturnType } from "@/lib/validations/tree";
import { EvidenceModal } from "@/app/app/tree/[treeId]/_component/evidence-modal";
import useCurrentLocation from "@/components/providers/location-provider";
import { MapModal } from "./map-modal";
import { AdditionalInfoModal } from "./additional-info-modal";
import VerifyTreeInfo from "./verify-tree-info";

type TreeModalContainerProps = {
  nearbyTree: NearbyTreeReturnType;
  security: Security;
};

const TreeModalContainer = ({
  nearbyTree,
  security,
}: TreeModalContainerProps) => {
  const {
    state: { latitude, longitude },
  } = useCurrentLocation();

  const userFound = latitude !== null && longitude !== null;

  return (
    <div className="flex space-x-2 justify-center mb-4">
      {userFound && (
        <MapModal
          nearbyTree={nearbyTree}
          userLocation={{ latitude, longitude }}
        />
      )}
      {nearbyTree && (
        <EvidenceModal
          evidences={nearbyTree.mediaEvidence}
          planterId=""
          treeId={nearbyTree.id}
          verificationStarted
          security={security}
        />
      )}
      <AdditionalInfoModal nearbyTree={nearbyTree} />
      <VerifyTreeInfo />
    </div>
  );
};

export default TreeModalContainer;
