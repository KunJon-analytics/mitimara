import { notFound } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTreeForReport } from "../service";
import ReportFormContainer from "./report-form-container";
import Link from "next/link";

type Params = Promise<{ id: string }>;

export async function TreeReportContent({ params }: { params: Params }) {
  const treeId = (await params).id;

  const tree = await getTreeForReport(treeId);

  if (!tree) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tree #{tree.id.slice(-6)}</span>
            <Badge variant={tree.isAuthentic ? "success" : "destructive"}>
              {tree.isAuthentic ? "Verified Real" : "Marked Fake"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Planted by {tree.planter.username} on{" "}
            {new Date(tree.createdAt).toLocaleDateString()}{" "}
            <Link
              href={`/app/tree/${tree.id}`}
              className="ml-2 text-success underline"
            >
              View Tree Details
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">Location</p>
              <p>
                {tree.latitude.toFixed(6)}, {tree.longitude.toFixed(6)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Verification Status</p>
              <div className="flex items-center">
                {tree.isAuthentic ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    <span>Verified as authentic</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-destructive mr-2" />
                    <span>Marked as fake</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Verifications</p>
            <p>
              {tree.verifications.length} verifier(s) have reviewed this tree
            </p>
          </div>

          <ReportFormContainer tree={tree} />
        </CardContent>
      </Card>
    </div>
  );
}
