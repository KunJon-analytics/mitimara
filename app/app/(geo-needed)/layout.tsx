import { ReactNode } from "react";

import { LocationProvider } from "@/components/providers/location-provider";

type GeoNeededLayoutProps = { children: ReactNode };

const GeoNeededLayout = ({ children }: GeoNeededLayoutProps) => {
  return <LocationProvider>{children}</LocationProvider>;
};

export default GeoNeededLayout;
