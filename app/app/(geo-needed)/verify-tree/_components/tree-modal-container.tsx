import { NearbyTreeReturnType } from "@/lib/validations/tree";
import { MapModal } from "./map-modal";
import { MediaEvidenceModal } from "./media-evidence-modal";
import { AdditionalInfoModal } from "./additional-info-modal";

type TreeModalContainerProps = {
  nearbyTree: NearbyTreeReturnType;
  latitude: number;
  longitude: number;
};

const TreeModalContainer = ({
  latitude,
  longitude,
  nearbyTree,
}: TreeModalContainerProps) => {
  return (
    <div className="flex space-x-2 mb-4">
      <MapModal
        nearbyTree={nearbyTree}
        userLocation={{ latitude, longitude }}
      />
      <MediaEvidenceModal nearbyTree={nearbyTree} />
      <AdditionalInfoModal nearbyTree={nearbyTree} />
    </div>
  );
};

export default TreeModalContainer;
