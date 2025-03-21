"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Terminal } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  rewardUserSchema,
  RewardUserValues,
} from "@/lib/validations/admin/reward-user";
import { rewardUser } from "@/actions/admin/reward-user";
import useCurrentSession from "@/components/providers/session-provider";
import { isAdmin } from "@/lib/validations/admin/is-admin";
import { LoadingAnimation } from "@/components/common/loading-animation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function RewardUserForm({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { accessToken, session } = useCurrentSession();
  const isAdminUser = isAdmin(session.username);

  const form = useForm<RewardUserValues>({
    resolver: zodResolver(rewardUserSchema),
    defaultValues: {
      pointType: "ecosystem",
      action: "reward",
      amount: 1,
      reason: "",
    },
  });

  function onSubmit(values: RewardUserValues) {
    startTransition(async () => {
      try {
        if (!isAdminUser) {
          toast.error("Unauthorized");
          return;
        }
        const result = await rewardUser({
          userId,
          pointType: values.pointType,
          action: values.action,
          amount: values.amount,
          reason: values.reason,
          accessToken,
        });

        if (result.success) {
          toast.success(
            `User has been ${
              values.action === "reward" ? "rewarded" : "penalized"
            } successfully.`
          );

          router.refresh();
          form.reset();
        } else {
          toast.error(result.error || "Something went wrong");
        }
      } catch (error) {
        console.log(error);
        toast.error("An unexpected error occurred");
      }
    });
  }

  if (!isAdminUser) {
    return (
      <Alert variant={"warning"}>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You are not autorized to carry out this action.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="pointType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Point Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ecosystem" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Ecosystem Points
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="policing" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Policing Points
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
          name="action"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Action</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="reward" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Reward (Add Points)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="penalize" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Penalize (Remove Points)
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
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="1"
                  placeholder="Enter amount"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the number of points to add or remove
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Explain why you are modifying this user's points"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This will be recorded for audit purposes
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={!isAdminUser || isPending}>
          {isPending ? <LoadingAnimation /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
