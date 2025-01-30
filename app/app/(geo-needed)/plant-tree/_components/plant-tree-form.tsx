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
import Subscribe from "@/components/payments/subscribe";
import { isWithinEvent } from "@/lib/local-bounty/utils";
import ConfirmTreeModal from "./confirm-tree-modal";

type LocalHunt = {
  id: string;
  centerLatitude: number;
  centerLongitude: number;
  radius: number;
};

type PlantTreeFormProps = { localhunt?: LocalHunt };

const PlantTreeForm = ({ localhunt }: PlantTreeFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { session, accessToken } = useCurrentSession();
  const { data: profile } = useProfile(session.id);
  const {
    state: { latitude, longitude, error, loading },
  } = useCurrentLocation();

  const noTreeLocation = latitude === null || longitude === null;

  const canPlantTreeForBounty =
    !!localhunt &&
    isWithinEvent({
      eventLat: localhunt.centerLatitude,
      eventLng: localhunt.centerLongitude,
      eventRadius: localhunt.radius,
      userLat: latitude as number,
      userLng: longitude as number,
    }).withinEvent;

  async function handleConfirm() {
    if (!!localhunt && !canPlantTreeForBounty) {
      toast.error(
        "You're not within the allowed location for the bounty contest. 🌳 To earn planter rewards, please visit the Plant Tree page. 🌱💚"
      );
      return;
    }
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
        const createTreeparams = {
          latitude,
          longitude,
          accessToken,
          localBountyId: localhunt?.id,
        };
        const result = await createTree(createTreeparams);

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
