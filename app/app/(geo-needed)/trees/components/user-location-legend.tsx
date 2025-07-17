"use client";

import { useMapSearchParams } from "@/hooks/use-map-search-params";

const UserLocationLegend = () => {
  const { searchParams } = useMapSearchParams();

  const hasLocation =
    searchParams.latitude !== null && searchParams.longitude !== null;

  if (!hasLocation) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
      <span>You</span>
    </div>
  );
};

export default UserLocationLegend;
