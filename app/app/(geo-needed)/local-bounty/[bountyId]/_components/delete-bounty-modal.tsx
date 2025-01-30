"use client";

import { useTransition, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { LoadingAnimation } from "@/components/common/loading-animation";
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
import { cn } from "@/lib/utils";
import { ButtonProps, Button } from "@/components/ui/button";
import useCurrentSession from "@/components/providers/session-provider";
import { deleteBountyHunt } from "@/actions/local-bounty/delete-bounty";

type DeleteBountyProps = ButtonProps & {
  bountyId: string;
};

const DeleteBountyModal = ({
  className,
  bountyId,
  ...props
}: DeleteBountyProps) => {
  const [open, setOpen] = useState(false);
  const { accessToken, session } = useCurrentSession();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function deleteBounty() {
    startTransition(async () => {
      try {
        const response = await deleteBountyHunt({ accessToken, id: bountyId });

        if (response.success) {
          toast.success("Local Bounty Hunt deleted successfully");
          router.push(`/app/local-bounty/creator/${session.id}`);
          // revalidate queries
          // Handle successful creation (e.g., show success message, redirect)
        } else {
          toast.error(response.error);
        }
      } catch (error) {
        // Handle error (e.g., show error message)
        toast.error("Network Error");
        console.error("Failed to create bounty:", error);
      }
    });
  }

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button
          className={cn(className)}
          {...props}
          onClick={() => setOpen(true)}
          variant={"destructive"}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Delete Local Bounty Hunt 🛑</CredenzaTitle>
          <CredenzaDescription>
            Are you sure you want to delete the Local Bounty Hunt contest? This
            action cannot be undone and will permanently remove the contest.
            🌿💚
          </CredenzaDescription>
        </CredenzaHeader>

        <CredenzaFooter>
          <Button
            onClick={deleteBounty}
            disabled={isPending}
            variant={"destructive"}
          >
            {isPending ? <LoadingAnimation /> : "Delete"}
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
};

export default DeleteBountyModal;
