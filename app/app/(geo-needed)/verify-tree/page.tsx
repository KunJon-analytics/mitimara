"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { submitVerification } from "@/actions/tree/submit-verification";
import useCurrentSession from "@/components/providers/session-provider";
import useCurrentLocation from "@/components/providers/location-provider";
import useFindNearbyTree from "@/hooks/queries/use-find-nearby-tree";
import { treeLogicConfig } from "@/config/site";
import { treeVerificationSchema } from "@/lib/validations/tree";
import LocationErrorCard from "../_components/location-error-card";
import { LoadingSkeleton } from "./_components/loading";
import NoNearbyTree from "./_components/no-nearby-tree";
import VerifyTreeForm from "./_components/verify-tree-form";
import useProfile from "@/hooks/queries/use-profile";
import InsufficientPoints from "../_components/insufficient-points";

export const dynamic = "force-dynamic";

export default function VerifyTree() {
  const [videoUrl, setVideoUrl] = useState("");
  const [isAuthentic, setIsAuthentic] = useState<boolean | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isLoading, startTransition] = useTransition();

  const {
    location: { latitude, longitude },
    error,
  } = useCurrentLocation();

  const queryClient = useQueryClient();

  const { accessToken, session } = useCurrentSession();
  const { data: nearbyTree, status } = useFindNearbyTree({
    accessToken,
    latitude,
    longitude,
  });
  const { data: profile } = useProfile(session.id);

  const userLocated = latitude !== null && longitude !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    startTransition(async () => {
      e.preventDefault();
      if (!nearbyTree || isAuthentic === null) return;

      const validatedFields = treeVerificationSchema.safeParse({
        treeId: nearbyTree.id,
        type: "VIDEO",
        accessToken,
        isAuthentic,
        url: videoUrl,
        additionalInfo,
      });

      if (!validatedFields.success) {
        const errrorString = `${validatedFields.error.issues[0].path}: ${validatedFields.error.issues[0].message}`;
        toast.error(errrorString);
        return;
      }

      // TODO: Replace 'current-user-id' with actual logged-in user ID
      const result = await submitVerification(validatedFields.data);

      if (result.success) {
        toast.success("Verification submitted", {
          description: "Thank you for verifying this tree!",
        });
      } else {
        toast.error("Error", {
          description: result.error,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["nearby-tree"] });
      queryClient.invalidateQueries({ queryKey: ["profile", session.id] });
    });
  };

  if (!session.isLoggedIn) {
    return (
      <NoNearbyTree
        title="Not Logged In"
        description={` Please log in to verify trees within{" "}
            ${treeLogicConfig.maxVerifierDistance}km of your location.`}
        showAuth={true}
      />
    );
  }

  if (error) {
    return <LocationErrorCard error={error} />;
  }

  if (!userLocated) {
    return <LoadingSkeleton loadingText="Loading user Location..." />;
  }

  if (isLoading || status === "pending") {
    return <LoadingSkeleton loadingText="Loading..." />;
  }

  if (!nearbyTree) {
    return (
      <NoNearbyTree
        title="No Trees Nearby"
        description="There are no unverified trees within 2km of your location."
        showAuth={false}
      />
    );
  }

  if (!profile || profile.points < treeLogicConfig.minVerifierPoints) {
    <InsufficientPoints
      bodyText="Verify Trees"
      minPoints={treeLogicConfig.minVerifierPoints}
      pointsBalance={profile?.points || 0}
      title="Insufficient Points"
    />;
  }

  return (
    <VerifyTreeForm
      additionalInfo={additionalInfo}
      handleSubmit={handleSubmit}
      isAuthentic={isAuthentic}
      latitude={latitude}
      longitude={longitude}
      nearbyTree={nearbyTree}
      setAdditionalInfo={setAdditionalInfo}
      setIsAuthentic={setIsAuthentic}
      setVideoUrl={setVideoUrl}
      videoUrl={videoUrl}
    />
  );
}
