"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import useCurrentSession from "@/components/providers/session-provider";
import useProfile from "@/hooks/queries/use-profile";
import LoginModal from "@/components/auth/login-modal";

export default function UserReferrals() {
  const [copied, setCopied] = useState(false);
  const { session } = useCurrentSession();
  const { data } = useProfile(session.id);

  const referralLink = session.isLoggedIn
    ? `${siteConfig.url}/app/invite?ref=${session.username}`
    : undefined;

  const copyToClipboard = async () => {
    try {
      if (!referralLink) {
        toast.warning(
          `Please sign in with your pi wallet to view your referral code`
        );
        return;
      }
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success(`Link copied successfully! Link: ${referralLink}`);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("failed to copy link");
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
              value={referralLink}
              readOnly
              className="flex-grow p-2 border rounded"
            />
            {session.isLoggedIn ? (
              <Button onClick={copyToClipboard} variant="outline">
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
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
