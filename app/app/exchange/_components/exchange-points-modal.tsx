"use client";

import { AlertTriangle } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
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
import useCurrentSession from "@/components/providers/session-provider";
import { LoadingAnimation } from "@/components/common/loading-animation";
import { exchangePoints } from "@/actions/rewards/exchange-points";

export function ExchangePointsModal({ disabled }: { disabled: boolean }) {
  const { accessToken } = useCurrentSession();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function onClick() {
    startTransition(async () => {
      try {
        const response = await exchangePoints(accessToken);

        if (response.success) {
          toast.success("You will receive your Pi rewards in 24-48 hours.");
          router.push(`/app/exchange/${response.exchangeId}`);
        } else {
          toast.error(response.error);
        }
      } catch (error) {
        // Handle error (e.g., show error message)
        toast.error("Network Error");
        console.error("Failed to delete product image:", error);
      }
    });
  }

  const handleOpen = () => {
    setOpen(true);
  };

  if (!accessToken) {
    return null;
  }

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button disabled={disabled} onClick={handleOpen} className="w-full">
          Exchange Points
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="p-4">
        <CredenzaHeader>
          <CredenzaTitle>Confirm Points Exchange</CredenzaTitle>
          <CredenzaDescription>
            Are you sure you want to exchange your Mitimara points for Pi
            tokens?
          </CredenzaDescription>
        </CredenzaHeader>
        <div className="flex items-center space-x-2 text-yellow-600">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm">
            Warning: All available points will be forfeited if foul play is
            detected in your planting or verification activities since your last
            claim or account creation.
          </p>
        </div>
        <CredenzaFooter>
          <Button onClick={onClick} disabled={isPending}>
            {isPending ? <LoadingAnimation /> : "Confirm Exchange"}
          </Button>

          <CredenzaClose asChild>
            <Button variant={"secondary"} type="button">
              Cancel
            </Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
