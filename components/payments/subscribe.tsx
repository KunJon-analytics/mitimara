"use client";

import { useTransition, useState } from "react";
import { Pi } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { siteConfig, subscriptionConfig } from "@/config/site";
import { LoadingAnimation } from "@/components/common/loading-animation";
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { PaymentDTOMemo } from "@/types/pi";
import { piPaymentCallbacks } from "@/lib/pi/callbacks";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "../ui/button";
import useCurrentSession from "../providers/session-provider";

type SubscribeProps = ButtonProps;

const Subscribe = ({ className, ...props }: SubscribeProps) => {
  const [open, setOpen] = useState(false);
  const { session, logout, status } = useCurrentSession();
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  function subscribe() {
    startTransition(async () => {
      try {
        const paymentData: {
          amount: number;
          memo: string;
          metadata: PaymentDTOMemo;
        } = {
          amount: subscriptionConfig.fee,
          memo: `Subscribe with π${subscriptionConfig.fee} for ${subscriptionConfig.userPointsPerPi} ${siteConfig.name} points`,
          metadata: { purpose: session.id, type: "SUBSCRIBE" },
        };

        const payment = await window.Pi.createPayment(
          paymentData,
          piPaymentCallbacks
        );
        console.log({ payment });
      } catch (error) {
        console.log("subscribe ERROR", { error });
        if (error instanceof Error) {
          // Inside this block, err is known to be a Error
          if (
            error.message === 'Cannot create a payment without "payments" scope'
          ) {
            logout();
            toast.error("Session expired, please sign in again.");
          }
        }
      } finally {
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ["profile", session.id] });
      }
    });
  }

  if (!session.isLoggedIn || status !== "success") {
    return null;
  }

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button
          className={cn(className)}
          {...props}
          onClick={() => setOpen(true)}
        >
          <Pi className="h-4 w-4" /> Subscribe
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Join the {siteConfig.name} Tribe! 🌟</CredenzaTitle>
          <CredenzaDescription>
            Unlock {subscriptionConfig.userPointsPerPi} {siteConfig.name} points
            with a Pi subscription. Help grow our green community and get
            rewarded. Your support means the world (literally). 🌍💚
          </CredenzaDescription>
        </CredenzaHeader>

        <CredenzaFooter>
          <Button onClick={() => subscribe()} disabled={isPending}>
            {isPending ? <LoadingAnimation /> : "Subscribe"}
          </Button>
          <CredenzaClose asChild>
            <Button variant={"destructive"} type="button">
              Cancel
            </Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default Subscribe;
