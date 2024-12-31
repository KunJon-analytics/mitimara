"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { createTree } from "@/actions/tree/create-tree";
import { Button } from "@/components/ui/button";
import useCurrentSession from "@/components/providers/session-provider";
import { LoadingAnimation } from "@/components/common/loading-animation";
import LoginModal from "@/components/auth/login-modal";

type PlantTreeFormProps = { latitude: number; longitude: number };

const PlantTreeForm = ({ latitude, longitude }: PlantTreeFormProps) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const { session, accessToken } = useCurrentSession();

  async function handleConfirm() {
    startTransition(async () => {
      if (!session.isLoggedIn) {
        toast.error("Unauthenticated!");
        return;
      }

      try {
        const result = await createTree({ latitude, longitude, accessToken });

        if (result.success) {
          toast.success("Tree added successfully, now you can add more ");
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

  return (
    <Button
      onClick={handleConfirm}
      disabled={isPending}
      className="w-full sm:w-auto"
    >
      {isPending ? <LoadingAnimation /> : "Confirm Tree Location"}
    </Button>
  );
};

export default PlantTreeForm;
