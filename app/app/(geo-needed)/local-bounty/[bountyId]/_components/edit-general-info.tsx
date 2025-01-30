"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";
import { addDays, isPast } from "date-fns";

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
import {
  updateBountySchema,
  UpdateBountySchema,
} from "@/lib/validations/local-bounty/update";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { CardFooter } from "@/components/ui/card";
import { LoadingAnimation } from "@/components/common/loading-animation";
import { updateBountyHunt } from "@/actions/local-bounty/update-bounty";

type EditGeneralInfoProps = {
  defaultValues: UpdateBountySchema;
};

export function EditGeneralInfo({ defaultValues }: EditGeneralInfoProps) {
  const [isPending, startTransition] = useTransition();
  const addUpdateDate = isPast(addDays(defaultValues.endDate, 1));

  useEffect(() => {
    const toastId = toast.info(
      `Action Required: Deposit Bounty ${
        addUpdateDate ? "& Update Dates " : ""
      }🛑`,
      {
        description: `Please deposit the bounty to start the contest. ${
          addUpdateDate
            ? "Also, update the start/end dates if they are in the past."
            : ""
        } 🌳💚`,
      }
    );

    return () => {
      toast.dismiss(toastId);
    };
  }, [addUpdateDate]);

  // 1. Define your form.
  const form = useForm<UpdateBountySchema>({
    resolver: zodResolver(updateBountySchema),
    defaultValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: UpdateBountySchema) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    startTransition(async () => {
      try {
        const result = await updateBountyHunt({
          ...values,
        });
        if (result.success) {
          toast.success("Local Bounty Hunt updated successfully");
          // revalidate queries
          // Handle successful creation (e.g., show success message, redirect)
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        // Handle error (e.g., show error message)
        toast.error("Network Error");
        console.error("Failed to create bounty:", error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Give your local bounty a catchy title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                Provide details about your local bounty challenge.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mr-2">Start </FormLabel>
              <FormControl>
                <DatePicker date={field.value} setDate={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mr-2">End </FormLabel>
              <FormControl>
                <DatePicker date={field.value} setDate={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalBounty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Bounty (Pi tokens)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) =>
                    field.onChange(Number.parseFloat(e.target.value))
                  }
                />
              </FormControl>
              <FormDescription>
                Set the total amount of Pi tokens for this bounty.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <CardFooter className="flex justify-between gap-2">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? <LoadingAnimation /> : "Update"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
