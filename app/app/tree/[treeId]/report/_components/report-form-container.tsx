"use client";

import { AlertCircle } from "lucide-react";

import useProfile from "@/hooks/queries/use-profile";
import useCurrentSession from "@/components/providers/session-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getTreeReportAuthorization, TreeForReport } from "../service";
import { TreeReportForm } from "./tree-report-form";

type Props = { tree: TreeForReport };

const ReportFormContainer = ({ tree }: Props) => {
  const { session, accessToken } = useCurrentSession();
  const { data } = useProfile(session.id);

  const user = data
    ? { id: session.id, policingPoints: data.policingPoints }
    : null;

  const { canReport, reason } = getTreeReportAuthorization(tree, user);

  return (
    <div>
      {!canReport && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Cannot Report</AlertTitle>
          <AlertDescription>{reason}</AlertDescription>
        </Alert>
      )}

      {canReport && (
        <TreeReportForm
          treeId={tree!.id}
          isAuthentic={tree!.isAuthentic}
          userPolicingPoints={data!.policingPoints}
          accessToken={accessToken}
        />
      )}
    </div>
  );
};

export default ReportFormContainer;
