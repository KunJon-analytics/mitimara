"use client";

import { useTransition, useState } from "react";
import { Pi } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { siteConfig } from "@/config/site";
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
import { ButtonProps, Button } from "@/components/ui/button";
import useCurrentSession from "@/components/providers/session-provider";

type DepositBountyProps = ButtonProps & {
  amount: number;
  bountyId: string;
  bountyTitle: string;
};

const DepositBountyModal = ({
  className,
  bountyId,
  amount,
  bountyTitle,
  ...props
}: DepositBountyProps) => {
  const [open, setOpen] = useState(false);
  const { logout, session } = useCurrentSession();
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const router = useRouter();

  function depositBounty() {
    startTransition(async () => {
      try {
        const paymentData: {
          amount: number;
          memo: string;
          metadata: PaymentDTOMemo;
        } = {
          amount,
          memo: `Deposit π${amount} for ${siteConfig.name} bounty hunt contest`,
          metadata: { purpose: bountyId, type: "LOCAL_BOUNTY" },
        };

        const payment = await window.Pi.createPayment(
          paymentData,
          piPaymentCallbacks
        );
        router.push(`/app/local-bounty/creator/${session.id}`);
        console.log({ payment });
      } catch (error) {
        console.log("deposit bounty ERROR", { error });
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
        queryClient.invalidateQueries({ queryKey: ["profile", session.id] });
        setOpen(false);
      }
    });
  }

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button
          className={cn(className)}
          {...props}
          onClick={() => setOpen(true)}
        >
          <Pi className="h-4 w-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Confirm Bounty Deposit 🏆</CredenzaTitle>
          <CredenzaDescription>
            You are about to deposit {amount} Pi tokens for the{" "}
            <span className="font-semibold">{bountyTitle} </span>
            Local Bounty Hunt contest. This step will make the bounty public and
            enable participants to start planting and verifying trees. 🌳💚
          </CredenzaDescription>
        </CredenzaHeader>

        <CredenzaFooter>
          <Button onClick={() => depositBounty()} disabled={isPending}>
            {isPending ? <LoadingAnimation /> : "Deposit"}
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

export default DepositBountyModal;
