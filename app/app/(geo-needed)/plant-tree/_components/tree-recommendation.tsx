"use client";

import { Coins, Leaf, Bot } from "lucide-react";
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
import useProfile from "@/hooks/queries/use-profile";
import { TREE_RECOMMENDATION_COST } from "@/config/site";
import useCurrentLocation from "@/components/providers/location-provider";
import { recommendTree } from "@/actions/tree/recommend-tree";
import { useQueryClient } from "@tanstack/react-query";

export function TreeRecommendation() {
  const { session, accessToken } = useCurrentSession();
  const { data } = useProfile(session.id);
  const {
    state: { latitude, longitude },
  } = useCurrentLocation();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const queryClient = useQueryClient();

  const hasEnoughPoints =
    !!data?.points && data.points >= TREE_RECOMMENDATION_COST;
  const noTreeLocation = latitude === null || longitude === null;
  const disabled = !hasEnoughPoints || noTreeLocation;

  function onClick() {
    startTransition(async () => {
      try {
        if (!hasEnoughPoints) {
          toast.error(
            `You need ${TREE_RECOMMENDATION_COST} points for a recommendation. You currently have ${data?.points} points.`
          );
          return;
        }
        if (noTreeLocation) {
          toast.error(
            "Failed to access your location. Please enable location services."
          );
          return;
        }
        // Call the server action to get a recommendation
        const response = await recommendTree({
          latitude,
          longitude,
          accessToken,
        });

        if (response.success) {
          toast.success("Request Submitted!", {
            description:
              "Our AI is working on your tree recommendation. We'll notify you when it's ready.",
          });
          // Redirect to the recommendations page
          queryClient.invalidateQueries({ queryKey: ["profile", session.id] });
          router.push("/app/my-recommendations");
        } else {
          toast.error(
            response.error || "Failed to request tree recommendation"
          );
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

  if (!session.isLoggedIn || noTreeLocation) {
    return null;
  }

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button
          disabled={disabled}
          onClick={handleOpen}
          size={"icon"}
          variant={"ghost"}
          className="animate-pulse text-success"
        >
          <Bot />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="p-4">
        <CredenzaHeader>
          <CredenzaTitle>Not sure what tree to plant?</CredenzaTitle>
          <CredenzaDescription>
            Let us recommend the perfect tree species for your location based on
            climate, soil conditions, and local ecosystem.
          </CredenzaDescription>
        </CredenzaHeader>
        <p className="text-sm text-muted-foreground mb-4">
          Our AI-powered recommendation system analyzes your location data to
          suggest native or well-adapted tree species that will thrive in your
          area while providing maximum environmental benefits.
        </p>
        <div className="flex items-center justify-between bg-muted p-3 rounded-md">
          <div className="flex items-center">
            <Coins className="h-5 w-5 mr-2 text-warning" />
            <span>Cost: {TREE_RECOMMENDATION_COST} points</span>
          </div>
          <div>
            <span
              className={`font-medium ${
                hasEnoughPoints ? "text-success" : "text-destructive"
              }`}
            >
              Your points: {data?.points || 0}
            </span>
          </div>
        </div>
        <CredenzaFooter>
          <Button onClick={onClick} disabled={isPending}>
            {isPending ? (
              <>
                <LoadingAnimation />
                Processing request...
              </>
            ) : hasEnoughPoints ? (
              <>
                <Leaf className="mr-2 h-4 w-4" />
                Request Tree Recommendation
              </>
            ) : (
              <>
                <Coins className="mr-2 h-4 w-4" />
                Subscribe for Points
              </>
            )}
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
