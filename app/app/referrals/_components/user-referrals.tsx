"use client";

import { toast } from "sonner";
import { Share2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useCurrentSession from "@/components/providers/session-provider";
import useProfile from "@/hooks/queries/use-profile";
import LoginModal from "@/components/auth/login-modal";
import { env } from "@/env.mjs";

export default function UserReferrals() {
  const { session, logout } = useCurrentSession();
  const { data } = useProfile(session.id);

  const referralLink = session.isLoggedIn
    ? `${env.NEXT_PUBLIC_PINET_URL}/app/invite?ref=${session.username}`
    : undefined;

  const onClick = async () => {
    try {
      await window.Pi.openShareDialog("Your Invite Link", referralLink);
    } catch (error) {
      console.error("share ERROR", { error });
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

  return (
    <div className="space-y-6">
      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {data?.noOfReferrals ?? 0} Referral(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-2">
            <input
              type="text"
              value={referralLink ?? ""}
              readOnly
              className="flex-grow p-2 border rounded"
            />
            {session.isLoggedIn ? (
              <Button onClick={onClick} variant="outline">
                <Share2 className="h-4 w-4" />
              </Button>
            ) : (
              <LoginModal />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
