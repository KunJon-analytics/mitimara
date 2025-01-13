"use client";

import React from "react";

import { treeLogicConfig } from "@/config/site";
import useCurrentSession from "@/components/providers/session-provider";
import LoginModal from "@/components/auth/login-modal";
import LogicLink from "./logic-link";

const DashboardLinks = () => {
  const { session } = useCurrentSession();

  if (!session.isLoggedIn) {
    return (
      <div className="flex justify-center">
        <LoginModal />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <LogicLink
        bodyText="Submit a new tree planting entry and earn rewards!"
        buttonText="Plant Tree"
        link="/app/plant-tree"
        minPoints={treeLogicConfig.minPlanterPoints}
        title="Plant a Tree"
      />
      <LogicLink
        bodyText=" Help verify other users' tree plantings and earn rewards!"
        buttonText="Verify Trees"
        link="/app/verify-tree"
        minPoints={treeLogicConfig.minVerifierPoints}
        title="Verify Trees"
      />
      <LogicLink
        bodyText="View and manage your unverified planted trees."
        buttonText="View My Trees"
        link="/app/my-trees"
        minPoints={0}
        title="My Unverified Trees"
      />
    </div>
  );
};

export default DashboardLinks;
