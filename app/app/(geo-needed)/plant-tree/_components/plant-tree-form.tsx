"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { createTree } from "@/actions/tree/create-tree";
import useCurrentSession from "@/components/providers/session-provider";
import LoginModal from "@/components/auth/login-modal";
import useCurrentLocation from "@/components/providers/location-provider";
import useProfile from "@/hooks/queries/use-profile";
import { treeLogicConfig } from "@/config/site";
import LocationErrorCard from "../../_components/location-error-card";
import ConfirmTreeModal from "./confirm-tree-modal";
import InsufficientPoints from "../../_components/insufficient-points";

const PlantTreeForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { session, accessToken } = useCurrentSession();
  const { data: profile } = useProfile(session.id);
  const {
    location: { latitude, longitude },
    error,
  } = useCurrentLocation();

  const noTreeLocation = latitude === null || longitude === null;

  async function handleConfirm() {
    startTransition(async () => {
      if (!session.isLoggedIn) {
        toast.error("Unauthenticated!");
        return;
      }

      if (noTreeLocation) {
        toast.error("No tree location!");
        return;
      }

      try {
        const result = await createTree({ latitude, longitude, accessToken });

        if (result.success) {
          toast.success("Tree added successfully, now you can add more info");
          queryClient.invalidateQueries({ queryKey: ["profile", session.id] });
          router.push(`/app/tree/${result.treeId}`);
        } else {
          // TODO: Handle error (e.g., show error message to user)
          toast.error(result.error);
          console.error(result.error);
        }
      } catch (error) {
        toast.error("Network error");
      }
    });
  }

  if (!session.isLoggedIn) {
    return <LoginModal />;
  }

  if (error) {
    return <LocationErrorCard error={error} />;
  }

  if (!profile || profile.points < treeLogicConfig.minPlanterPoints) {
    <InsufficientPoints
      bodyText="Plant Tree"
      minPoints={treeLogicConfig.minPlanterPoints}
      pointsBalance={profile?.points || 0}
      title="Insufficient Points"
    />;
  }

  return (
    <ConfirmTreeModal handleConfirm={handleConfirm} isPending={isPending} />
  );
};

export default PlantTreeForm;
