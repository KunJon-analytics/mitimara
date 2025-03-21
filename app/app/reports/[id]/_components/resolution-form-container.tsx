"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

import { ReportResolutionForm } from "./report-resolution-form";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import useCurrentSession from "@/components/providers/session-provider";
import { isAdmin } from "@/lib/validations/admin/is-admin";

type Props = { reportId: string; treeIsAuthentic: boolean };

const ResolutionFormContainer = ({ reportId, treeIsAuthentic }: Props) => {
  const { session } = useCurrentSession();
  const isAdminUser = isAdmin(session.username);

  if (!isAdminUser) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resolve Report</CardTitle>
        <CardDescription>
          Review the tree and report carefully before making a decision
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 border rounded-md bg-yellow-50 mb-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Resolution Impact</p>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-yellow-800">
                {treeIsAuthentic ? (
                  <>
                    <li>
                      This is a report against a tree marked as{" "}
                      <strong>REAL</strong>
                    </li>
                    <li>
                      If <strong>AGREED</strong>: Reporter gets 2 policing
                      points, planter loses points, verifiers with {`"real"`}{" "}
                      lose points + penalty, verifiers with {`"fake"`} gain
                      points
                    </li>
                    <li>
                      If <strong>DECLINED</strong>: No further action
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      This is a contest for a tree marked as{" "}
                      <strong>FAKE</strong>
                    </li>
                    <li>
                      If <strong>AGREED</strong>: Planter gains points,
                      verifiers with {`"real"`} gain points, verifiers with
                      {`"fake"`} lose points + penalty
                    </li>
                    <li>
                      If <strong>DECLINED</strong>: Tree will be archived
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        <ReportResolutionForm reportId={reportId} />
      </CardContent>
    </Card>
  );
};

export default ResolutionFormContainer;
