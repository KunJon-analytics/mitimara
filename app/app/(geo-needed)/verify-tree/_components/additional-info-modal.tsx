"use client";

import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NearbyTreeReturnType } from "@/lib/validations/tree";

type AdditionalInfoModalProps = {
  nearbyTree: NearbyTreeReturnType;
};

export function AdditionalInfoModal({ nearbyTree }: AdditionalInfoModalProps) {
  if (!nearbyTree) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Info className="h-4 w-4 animate-pulse text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Additional Information</DialogTitle>
          <DialogDescription>
            Additional details provided about this tree.
          </DialogDescription>
        </DialogHeader>
        <p className="mt-4">
          {nearbyTree.additionalInfo || "No additional information provided."}
        </p>
      </DialogContent>
    </Dialog>
  );
}
