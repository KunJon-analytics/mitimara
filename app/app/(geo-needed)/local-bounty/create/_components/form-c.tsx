"use client";

import { Calendar, Coins, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  createBountySchema,
  CreateBountySchema,
} from "@/lib/validations/local-bounty/create";
import {
  Card,
  CardFooter,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingAnimation } from "@/components/common/loading-animation";
import { createBounty } from "@/actions/local-bounty/create-bounty";
import useCurrentSession from "@/components/providers/session-provider";
import { Separator } from "@/components/ui/separator";
import useBountyForm from "./bounty-form-context";

export function FormC() {
  const { formState, setFormStep } = useBountyForm();
  const { session } = useCurrentSession();

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const queryClient = useQueryClient();

  // 1. Define your form.
  const form = useForm<CreateBountySchema>({
    resolver: zodResolver(createBountySchema),
    defaultValues: formState,
  });

  // 2. Define a submit handler.
  function onSubmit(values: CreateBountySchema) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    startTransition(async () => {
      try {
        const result = await createBounty({
          ...values,
        });
        if (result.success) {
          toast.success("Local Bounty Hunt created successfully");
          router.push(`/app/local-bounty/${result.localBountyId}`);
          queryClient.invalidateQueries({ queryKey: ["profile", session.id] });
        } else {
          toast.error(result.error);
        }
        // Handle successful creation (e.g., show success message, redirect)
      } catch (error) {
        // Handle error (e.g., show error message)
        toast.error("Network Error");
        console.error("Failed to create bounty:", error);
      }
    });
  }

  return (
    <Form {...form}>
      <Card className="w-72 sm:w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              {form.getValues("title")}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {form.getValues("description")}
          </p>

          <Separator />

          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Location</p>
              <p className="text-xs text-muted-foreground">
                {form.getValues("centerLatitude").toFixed(6)},{" "}
                {form.getValues("centerLongitude").toFixed(6)}
              </p>
              <p className="text-xs text-muted-foreground">
                Radius: {form.getValues("radius")} km
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Duration</p>
              <p className="text-xs text-muted-foreground">
                {form.getValues("startDate").toLocaleDateString()} -{" "}
                {form.getValues("endDate").toLocaleDateString()}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Total Bounty</p>
            </div>
            <p className="text-lg font-bold">
              {form.getValues("totalBounty")} Pi tokens
            </p>
          </div>
        </CardContent>
      </Card>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
        <CardFooter className="flex justify-between gap-2 sm:gap-4">
          <Button
            type="button"
            variant={"secondary"}
            disabled={isPending}
            onClick={() => setFormStep("information")}
            className="w-full"
          >
            Back
          </Button>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? <LoadingAnimation /> : "Create"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
