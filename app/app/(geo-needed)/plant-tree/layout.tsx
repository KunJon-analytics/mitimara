import { ReactNode } from "react";

import AppContainer from "@/components/app/app-container";

const PlantTreeLayout = ({ children }: { children: ReactNode }) => {
  return <AppContainer pageTitle="Plant a Tree">{children}</AppContainer>;
};

export default PlantTreeLayout;
