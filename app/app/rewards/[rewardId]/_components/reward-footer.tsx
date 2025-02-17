"use client";

import { AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";
import { useTransition } from "react";
import { toast } from "sonner";

import useCurrentSession from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { LoadingAnimation } from "@/components/common/loading-animation";

type RewardFooterProps = {
  huntEnded: boolean;
  rewardClaimed: boolean;
  userId: string;
  rewardId: string;
};

const RewardFooter = ({
  huntEnded,
  rewardClaimed,
  userId,
  rewardId,
}: RewardFooterProps) => {
  const [isPending, startTransition] = useTransition();
  const { session, accessToken } = useCurrentSession();
  const isOwner = session.id === userId;

  const onClick = () => {
    startTransition(async () => {
      try {
        const response = await axios.post(
          `/api/payments/reward/${rewardId}/claim`,
          { accessToken },
          { timeout: 60000 }
        );

        if (response.data.success) {
          toast.success(
            "Pi rewards will arrive in your wallet soon (check wallet in 2 minutes)"
          );
          // revalidate queries
          // Handle successful creation (e.g., show success message, redirect)
        } else {
          toast.error(response.data.error);
        }
      } catch (error) {
        // Handle error (e.g., show error message)
        toast.error("Network Error");
        console.error("Failed to create bounty:", error);
      }
    });
  };

  return (
    <CardFooter>
      {isOwner && huntEnded && !rewardClaimed ? (
        <Button className="w-full" disabled={isPending} onClick={onClick}>
          Claim Reward {isPending && <LoadingAnimation />}
        </Button>
      ) : rewardClaimed ? (
        <div className="w-full text-center text-green-600 flex items-center justify-center">
          <CheckCircle className="mr-2 h-5 w-5" />
          Reward Claimed
        </div>
      ) : (
        <div className="w-full text-center text-muted-foreground flex items-center justify-center">
          <AlertCircle className="mr-2 h-5 w-5" />
          {huntEnded ? "Reward not claimable" : "Hunt still in progress"}
        </div>
      )}
    </CardFooter>
  );
};

export default RewardFooter;
