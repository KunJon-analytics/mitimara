"use client";

import { LoadingAnimation } from "@/components/common/loading-animation";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { siteConfig, treeLogicConfig } from "@/config/site";

type ConfirmTreeModalProps = {
  handleConfirm(): Promise<void>;
  isPending: boolean;
};

const notifications = [
  "Your current location will be used to create the tree entry.",
  `${treeLogicConfig.minPlanterPoints} of your ${siteConfig.name} points will be temporarily reduced.`,
  "These points can only be regained once the tree is verified as authentic by other users.",
  "The tree location cannot be changed after confirmation.",
];

const ConfirmTreeModal = ({
  handleConfirm,
  isPending,
}: ConfirmTreeModalProps) => {
  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button className="w-full sm:w-auto">Confirm Tree Location</Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Confirm Tree Location</CredenzaTitle>
          <CredenzaDescription>
            Please confirm the location of your newly planted tree
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <div>
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
              >
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {notification}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CredenzaBody>
        <CredenzaFooter>
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending ? <LoadingAnimation /> : "Confirm Location"}
          </Button>
          <CredenzaClose asChild>
            <Button variant={"destructive"}>Cancel</Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default ConfirmTreeModal;
