"use client";

import React, { useTransition } from "react";
import { HandCoins } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { siteConfig } from "@/config/site";
import { LoadingAnimation } from "@/components/common/loading-animation";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
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
import { PaymentDTOMemo } from "@/types/pi";
import { donationSchema, DonationSchema } from "@/lib/validations/payments";
import { piPaymentCallbacks } from "@/lib/pi/callbacks";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import useCurrentSession from "../providers/session-provider";

const Donate = ({ className }: { className?: string }) => {
  const { session, logout, status } = useCurrentSession();
  const [isPending, startTransition] = useTransition();

  // 1. Define your form.
  const form = useForm<DonationSchema>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 1,
    },
  });

  function onSubmit(values: DonationSchema) {
    startTransition(async () => {
      try {
        const paymentData: {
          amount: number;
          memo: string;
          metadata: PaymentDTOMemo;
        } = {
          amount: values.amount,
          memo: `Donate π${values.amount} to ${siteConfig.name} `,
          metadata: { purpose: session.id, type: "DONATE" },
        };

        const payment = await window.Pi.createPayment(
          paymentData,
          piPaymentCallbacks
        );
        console.log({ payment });
      } catch (error) {
        console.log("donate ERROR", { error });
        if (error instanceof Error) {
          // Inside this block, err is known to be a Error
          if (
            error.message === 'Cannot create a payment without "payments" scope'
          ) {
            logout();
            toast.error("Session expired, please sign in again.");
          }
        }
      }
    });
  }

  if (!session.isLoggedIn || status !== "success") {
    return null;
  }

  return (
    <Credenza>
      <CredenzaTrigger asChild className={cn(className)}>
        <Button variant="outline" size="icon">
          <HandCoins className="h-4 w-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{`${siteConfig.name}'s Tree Fund! 🌳`}</CredenzaTitle>
          <CredenzaDescription>
            Thanks for fueling our green mission! Your donation makes the world
            leafier and earns you good karma. 🌍💚
          </CredenzaDescription>
        </CredenzaHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CredenzaBody>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the amount of Pi you want to donate.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CredenzaBody>
            <CredenzaFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? <LoadingAnimation /> : "Donate Pi"}
              </Button>
              <CredenzaClose asChild>
                <Button variant={"destructive"} type="button">
                  Cancel
                </Button>
              </CredenzaClose>
            </CredenzaFooter>
          </form>
        </Form>
      </CredenzaContent>
    </Credenza>
  );
};

export default Donate;
