"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Security } from "filestack-js";

import { submitVerification } from "@/actions/tree/submit-verification";
import useCurrentSession from "@/components/providers/session-provider";
import useCurrentLocation from "@/components/providers/location-provider";
import useFindNearbyTree from "@/hooks/queries/use-find-nearby-tree";
import { treeLogicConfig } from "@/config/site";
import useProfile from "@/hooks/queries/use-profile";
import {
  treeVerificationSchema,
  VerifyTreeFormState,
} from "@/lib/validations/tree";
import LocationErrorCard from "../../_components/location-error-card";
import { LoadingSkeleton } from "./loading";
import NoNearbyTree from "./no-nearby-tree";
import VerifyTreeForm from "./verify-tree-form";
import InsufficientPoints from "../../_components/insufficient-points";

type VerifyTreeProps = { security: Security };

export default function VerifyTreeClient({ security }: VerifyTreeProps) {
  const [formState, setFormState] = useState<VerifyTreeFormState>({
    additionalInfo: "",
    isAuthentic: null,
    videoUrl: "",
    code: "",
  });
  const [isLoading, startTransition] = useTransition();

  const {
    state: { latitude, longitude, error },
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
    const { additionalInfo, isAuthentic, videoUrl, code } = formState;
    e.preventDefault();
    startTransition(async () => {
      if (!nearbyTree || isAuthentic === null) return;

      const validatedFields = treeVerificationSchema.safeParse({
        treeId: nearbyTree.id,
        type: "VIDEO",
        accessToken,
        isAuthentic,
        code,
        url: videoUrl ? videoUrl : undefined,
        additionalInfo: additionalInfo ? additionalInfo : undefined,
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
      queryClient.invalidateQueries({ queryKey: ["my-trees"] });
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
    return <LocationErrorCard error={error.message} />;
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
      handleSubmit={handleSubmit}
      nearbyTree={nearbyTree}
      formState={formState}
      setFormState={setFormState}
      security={security}
    />
  );
}
