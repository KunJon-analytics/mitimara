"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  treeReportFormSchema,
  TreeReportFormSchema,
} from "@/lib/validations/tree";
import { LoadingAnimation } from "@/components/common/loading-animation";
import { createTreeReport } from "@/actions/tree/create-tree-report";

interface TreeReportFormProps {
  treeId: string;
  accessToken: string;
  isAuthentic: boolean;
  userPolicingPoints: number;
}

export function TreeReportForm({
  treeId,
  isAuthentic,
  accessToken,
  userPolicingPoints,
}: TreeReportFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<TreeReportFormSchema>({
    resolver: zodResolver(treeReportFormSchema),
    defaultValues: {
      report: "",
      accessToken,
      treeId,
    },
  });

  function onSubmit(values: TreeReportFormSchema) {
    startTransition(async () => {
      try {
        const result = await createTreeReport({
          treeId,
          report: values.report,
          accessToken,
        });

        if (result.success) {
          toast.success("Report Submitted", {
            icon: <CheckCircle className="h-4 w-4" />,
            description:
              "Your report has been submitted successfully and will be reviewed by the team.",
          });
          router.push(`/app/tree/${treeId}`);
        } else {
          toast.error("Error", {
            icon: <AlertCircle className="h-4 w-4" />,
            description: result.error || "Something went wrong",
          });
        }
      } catch (error) {
        console.log(error);
        toast.error("Error", {
          icon: <AlertCircle className="h-4 w-4" />,
          description: "An unexpected error occurred",
        });
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-md bg-background">
        <p className="font-medium">Important Information</p>
        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
          <li>
            Submitting this report will use 1 policing point from your account
          </li>
          <li>You currently have {userPolicingPoints} policing point(s)</li>
          <li>False reports may result in penalties</li>
          <li>
            {isAuthentic
              ? "You are reporting a tree that was marked as REAL but you believe is FAKE"
              : "You are contesting a tree that was marked as FAKE but you believe is REAL"}
          </li>
        </ul>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="report"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide detailed information about why you are reporting this tree. Include any evidence or observations that support your claim."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Include links to any supporting evidence (photos, videos,
                  etc.)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending || userPolicingPoints < 1}
            className="w-full sm:w-auto"
          >
            {isPending ? <LoadingAnimation /> : "Submit Report"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
