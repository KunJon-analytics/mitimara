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
import ConfirmTreeModal from "./confirm-tree-modal";
import Subscribe from "@/components/payments/subscribe";

const PlantTreeForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { session, accessToken } = useCurrentSession();
  const { data: profile } = useProfile(session.id);
  const {
    state: { latitude, longitude, error, loading },
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
          queryClient.invalidateQueries({ queryKey: ["my-trees", session.id] });
          router.push(`/app/tree/${result.treeId}`);
        } else {
          // TODO: Handle error (e.g., show error message to user)
          toast.error(result.error);
          console.log(result.error);
        }
      } catch (error) {
        console.log(error);
        toast.error("Network error");
      }
    });
  }

  if (!session.isLoggedIn) {
    return <LoginModal className="w-full sm:w-auto" />;
  }

  if (loading) {
    return null;
  }

  if (error) {
    return null;
  }

  if (!profile || profile.points < treeLogicConfig.minPlanterPoints) {
    return (
      <Subscribe
        className="w-full sm:w-auto"
        buttonText="Get Points"
        modalDescription={`Oops! You need more points to plant a tree. 🌳 You have ${
          profile?.points || 0
        } points, but you need ${treeLogicConfig.minPlanterPoints} points.`}
      />
    );
  }

  return (
    <ConfirmTreeModal handleConfirm={handleConfirm} isPending={isPending} />
  );
};

export default PlantTreeForm;
