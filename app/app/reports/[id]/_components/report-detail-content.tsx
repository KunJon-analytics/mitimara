import { notFound } from "next/navigation";
import { TreesIcon as Tree, User, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getReportDetails } from "../service";
import ResolutionFormContainer from "./resolution-form-container";

type Params = Promise<{ id: string }>;

export async function ReportDetailContent({ params }: { params: Params }) {
  const reportId = (await params).id;

  const report = await getReportDetails(reportId);
  if (!report) {
    notFound();
  }

  const statusVariant = {
    PENDING: "outline",
    AGREED: "success",
    DECLINED: "destructive",
  }[report.status] as "outline" | "success" | "destructive";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Report #{report.id.slice(-6)}</h1>
          <p className="text-muted-foreground">
            Created on {new Date(report.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge variant={statusVariant} className="self-start sm:self-auto">
          {report.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Reporter</p>
                <p>{report.reporter.username}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Dates</p>
                <p>Created: {new Date(report.createdAt).toLocaleString()}</p>
                <p>Updated: {new Date(report.updatedAt).toLocaleString()}</p>
              </div>
            </div>

            {report.resolver && (
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Resolved By</p>
                  <p>{report.resolver}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Tree Information</span>
              <Badge
                variant={report.tree.isAuthentic ? "success" : "destructive"}
              >
                {report.tree.isAuthentic ? "Verified Real" : "Marked Fake"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <Tree className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Tree #{report.tree.id.slice(-6)}</p>
                <p>Planted by: {report.tree.planter.username}</p>
                <p>
                  Planted on:{" "}
                  {new Date(report.tree.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="w-full">
              <Link
                href={`/app/tree/${report.tree.id}`}
                className="flex items-center"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Tree Details
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">
            {report.report}
          </div>
        </CardContent>
      </Card>

      {report.status === "PENDING" && (
        <ResolutionFormContainer
          reportId={report.id}
          treeIsAuthentic={report.tree.isAuthentic}
        />
      )}
    </div>
  );
}
