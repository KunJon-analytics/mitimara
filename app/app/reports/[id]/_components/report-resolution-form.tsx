"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertCircle, CheckCircle } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  resolutionFormSchema,
  ResolutionFormValues,
} from "@/lib/validations/tree";
import { LoadingAnimation } from "@/components/common/loading-animation";
import { resolveReport } from "@/actions/admin/resolve-report";
import useCurrentSession from "@/components/providers/session-provider";

export function ReportResolutionForm({ reportId }: { reportId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { accessToken } = useCurrentSession();

  const form = useForm<ResolutionFormValues>({
    resolver: zodResolver(resolutionFormSchema),
    defaultValues: {
      resolution: undefined,
      notes: "",
      reportId,
      accessToken,
    },
  });

  function onSubmit(values: ResolutionFormValues) {
    startTransition(async () => {
      try {
        const result = await resolveReport(values);

        if (result.success) {
          toast.success("Report Resolved", {
            icon: <CheckCircle className="h-4 w-4" />,
            description: `The report has been marked as ${values.resolution}.`,
          });

          router.refresh();
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="resolution"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Resolution</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="AGREED" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Agree with Report
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="DECLINED" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Decline Report
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resolution Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide notes about your decision"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                These notes will be recorded for audit purposes
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row gap-2">
          <Button type="submit" disabled={isPending} className="sm:flex-1">
            {isPending ? <LoadingAnimation /> : "Submit Resolution"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            className="sm:flex-1"
          >
            Reset Form
          </Button>
        </div>
      </form>
    </Form>
  );
}
