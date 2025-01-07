"use client";

import { Image } from "lucide-react";

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
import VideoPlayer from "@/components/common/video-player";

type MediaEvidenceModalProps = {
  nearbyTree: NearbyTreeReturnType;
};

export function MediaEvidenceModal({ nearbyTree }: MediaEvidenceModalProps) {
  if (!nearbyTree) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Image className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Media Evidence</DialogTitle>
          <DialogDescription>
            Pictures and videos submitted as evidence for this tree.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {nearbyTree.mediaEvidence.map((evidence) => (
            <div key={evidence.url} className="flex items-center gap-4">
              {evidence.type === "IMAGE" ? (
                <img
                  src={evidence.url}
                  alt="Tree evidence"
                  className="w-40 h-40 object-cover rounded"
                />
              ) : (
                <VideoPlayer url={evidence.url} height={160} width={160} />
              )}
              <a
                href={evidence.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {evidence.type === "IMAGE" ? "View Picture" : "View Video"}
              </a>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
