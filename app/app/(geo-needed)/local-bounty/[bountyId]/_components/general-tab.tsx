"use client";

import { toast } from "sonner";
import { isWithinInterval } from "date-fns";
import { Share2, Sprout } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetBountyHuntDetail } from "@/lib/validations/local-bounty/service";
import useCurrentSession from "@/components/providers/session-provider";
import { env } from "@/env.mjs";
import { EditGeneralInfo } from "./edit-general-info";
import { GeneralInfo } from "./general-info";
import DepositBountyModal from "./deposit-bounty-modal";
import DeleteBountyModal from "./delete-bounty-modal";

type GeneralTabProps = {
  bountyHunt: GetBountyHuntDetail;
};

export function GeneralTab({ bountyHunt }: GeneralTabProps) {
  const { session, accessToken, logout } = useCurrentSession();
  const isCreator = session.id === bountyHunt?.creator.id;

  const canEdit = isCreator && !bountyHunt.paymentId;
  const contestLink = `${env.NEXT_PUBLIC_PINET_URL}/app/local-bounty/${bountyHunt?.id}`;

  const share = async () => {
    try {
      await window.Pi.openShareDialog(
        "Share Bounty Hunt Contest 🌳",
        contestLink
      );
    } catch (error) {
      console.log("share ERROR", { error });
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
  };

  if (!bountyHunt) {
    return null;
  }

  const isActive =
    !!bountyHunt.paymentId &&
    isWithinInterval(new Date(), {
      start: bountyHunt.startDate,
      end: bountyHunt.endDate,
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div>General Info</div>
          <div className="flex gap-2">
            {isActive && (
              <>
                <Button asChild>
                  <Link href={`/app/local-bounty/${bountyHunt.id}/hunt`}>
                    <Sprout className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant={"outline"} onClick={share}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </>
            )}
            {canEdit && (
              <>
                <DepositBountyModal
                  amount={bountyHunt.totalBounty}
                  bountyId={bountyHunt.id}
                  bountyTitle={bountyHunt.title}
                  className="ml-2"
                />
                <DeleteBountyModal bountyId={bountyHunt.id} />
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {canEdit ? (
          <EditGeneralInfo
            defaultValues={{
              ...bountyHunt,
              accessToken,
              description: bountyHunt.description ?? undefined,
            }}
          />
        ) : (
          <GeneralInfo localHunt={bountyHunt} />
        )}
      </CardContent>
    </Card>
  );
}
