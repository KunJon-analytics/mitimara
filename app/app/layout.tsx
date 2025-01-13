import React from "react";

import AppLayoutContainer from "./_components/app-layout-container";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return <AppLayoutContainer>{children}</AppLayoutContainer>;
};

export default AppLayout;
