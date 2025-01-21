"use client";

import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NearbyTreeReturnType } from "@/lib/validations/tree";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";

type AdditionalInfoModalProps = {
  nearbyTree: NearbyTreeReturnType;
};

export function AdditionalInfoModal({ nearbyTree }: AdditionalInfoModalProps) {
  if (!nearbyTree) {
    return null;
  }

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button variant="ghost" size="icon">
          <Info className="h-4 w-4 animate-pulse text-primary" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="p-4">
        <CredenzaHeader>
          <CredenzaTitle>Additional Information</CredenzaTitle>
          <CredenzaDescription>
            {nearbyTree.additionalInfo || "No additional information provided."}
          </CredenzaDescription>
        </CredenzaHeader>
      </CredenzaContent>
    </Credenza>
  );
}
