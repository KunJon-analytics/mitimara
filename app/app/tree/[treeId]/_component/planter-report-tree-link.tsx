"use client";

import React from "react";
import Link from "next/link";

import { $Enums } from "@prisma/client";
import useCurrentSession from "@/components/providers/session-provider";

type Params = {
  treeId: string;
  planterId: string;
  treeStage: $Enums.TreeStatus;
  isAuthentic: boolean;
  report: { id: string } | null;
};

const PlanterReportTreeLink = ({
  treeId,
  treeStage,
  report,
  planterId,
  isAuthentic,
}: Params) => {
  const { session } = useCurrentSession();

  // states
  // 1: Tree is not matured
  if (treeStage !== "MATURED") {
    return null;
  }

  // 2: There is report
  if (report) {
    return (
      <Link
        href={`/app/reports/${report.id}`}
        className="underline text-warning"
      >
        View Tree Report
      </Link>
    );
  }

  // 3: Tree is no report and is fake
  if (!isAuthentic && session.id === planterId) {
    return (
      <Link
        href={`/app/tree/${treeId}/report`}
        className="underline text-warning"
      >
        Contest Verification
      </Link>
    );
  }

  return null;
};

export default PlanterReportTreeLink;
