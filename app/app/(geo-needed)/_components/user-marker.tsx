"use client";

import { Marker } from "react-map-gl/maplibre";
import { User } from "lucide-react";

type UserMarkerProps = {
  userLocation: {
    latitude: number;
    longitude: number;
  };
};

const UserMarker = ({ userLocation }: UserMarkerProps) => {
  return (
    <Marker
      latitude={userLocation.latitude}
      longitude={userLocation.longitude}
      anchor="bottom"
    >
      <div className="flex flex-col items-center">
        <div className="bg-purple-500 text-white p-2 rounded-full shadow-lg">
          <User className="h-4 w-4" />
        </div>
        <div className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-purple-500"></div>
      </div>
    </Marker>
  );
};

export default UserMarker;
