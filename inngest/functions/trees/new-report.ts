import { MIN_POLICING_POINTS } from "@/config/site";
import { env } from "@/env.mjs";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const treeReportedEvent = inngest.createFunction(
  { id: "tree-reported" },
  { event: "tree/tree.reported" },
  async ({ event, step }) => {
    const { treeId, report, reporterId } = event.data;

    // get reported Tree
    const reportedTree = await step.run("get-reported-tree", async () => {
      return prisma.tree.findUnique({
        where: {
          id: treeId,
          status: "MATURED",
          report: null,
        },
        select: {
          isAuthentic: true,
        },
      });
    });

    // return if no tree
    if (!reportedTree) {
      return { message: "Invalid Tree" };
    }

    // create tree report
    const reportData = await step.run("create-tree-report", async () => {
      return prisma.$transaction(async (tx) => {
        // Create the report
        const newReport = await tx.treeReport.create({
          data: {
            report,
            treeId,
            reporterId,
          },
          select: { id: true },
        });

        // Subtract a policing point from the user
        const reporter = await tx.user.update({
          where: { id: reporterId },
          data: {
            policingPoints: {
              decrement: MIN_POLICING_POINTS,
            },
          },
          select: { username: true },
        });

        return { ...newReport, reporterUsername: reporter.username };
      });
    });

    // send TG Admin message for new tree report
    const treeUrl = `${env.NEXT_PUBLIC_PINET_URL}/app/tree/${treeId}`;
    const reportUrl = `${env.NEXT_PUBLIC_PINET_URL}/app/reports/${reportData.id}`;

    // Create report snippet (first 100 characters)
    const snippet =
      report.length > 100 ? report.substring(0, 100) + "..." : report;

    const message = `
    <b>🚨 NEW TREE REPORT</b>
    
    <b>Tree:</b> <a href="${treeUrl}">Tree #${treeId.slice(-6)}</a>
    
    <b>Type:</b> ${
      !reportedTree.isAuthentic
        ? "⚠️ Contesting tree marked as FAKE"
        : "❌ Reporting tree marked as REAL"
    }
    
    <b>Reporter:</b> ${reportData.reporterUsername}
    
    <b>Report Snippet:</b>
    <i>${snippet}</i>
    
    <b><a href="${reportUrl}">👉 REVIEW THIS REPORT</a></b>
    `;

    await step.sendEvent("send-tree-reported-notification", {
      name: "notifications/telegram.post",
      data: { message, type: "BUG_REPORT" },
    });

    // return

    return { message: `New tree Report: ${reportData.id} added!!!` };
  }
);
