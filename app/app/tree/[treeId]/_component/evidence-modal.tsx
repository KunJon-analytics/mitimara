"use client";

import { usePathname } from "next/navigation";
import { Image } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { $Enums } from "@prisma/client";
import { treeLogicConfig } from "@/config/site";
import VideoPlayer from "@/components/common/video-player";
import useCurrentSession from "@/components/providers/session-provider";
import { getImageUrlWithPolicy } from "@/lib/utils";
import DeleteEvidenceForm from "./delete-evidence-form";
import AddEvidenceTabs from "./add-evidence-tabs";
import MediaModal from "./media-modal";

type Security = { policy: string; signature: string };

type Evidence = {
  id: string;
  type: $Enums.MediaType;
  url: string;
};

type EvidenceModalProps = {
  treeId: string;
  evidences: Evidence[];
  planterId: string;
  verificationStarted: boolean;
  security: Security;
};

export function EvidenceModal({
  treeId,
  evidences,
  planterId,
  verificationStarted,
  security,
}: EvidenceModalProps) {
  const pathname = usePathname();

  const { session } = useCurrentSession();

  const isPlanter = session.id === planterId;
  const isAuthorized = isPlanter && !verificationStarted;

  const isVerificationPage = pathname.includes("verify");

  const alertPlanter = evidences.length < 1 && isAuthorized;

  useEffect(() => {
    if (alertPlanter) {
      toast.info("Add media evidence to list tree for verification", {
        icon: <Image />,
        position: "top-right",
      });
    }
  }, [alertPlanter, toast]);

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button
          variant={isVerificationPage ? "ghost" : "outline"}
          size={isVerificationPage ? "icon" : undefined}
        >
          <Image className="h-4 w-4 animate-pulse text-primary" />{" "}
          {isVerificationPage
            ? null
            : alertPlanter
            ? "Add Evidence"
            : "View Evidence"}
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle>Tree Evidence</CredenzaTitle>
          <CredenzaDescription>
            View and manage evidence for this tree.
          </CredenzaDescription>
        </CredenzaHeader>
        <div className="grid gap-4 py-4">
          {evidences.map((evidence) => (
            <div
              key={evidence.id}
              className="flex items-center justify-center gap-4"
            >
              {evidence.type === "IMAGE" ? (
                <img
                  src={getImageUrlWithPolicy(evidence.url, security)}
                  alt="Tree evidence"
                  className="w-40 h-40 object-cover rounded"
                />
              ) : (
                <VideoPlayer url={evidence.url} height={160} width={160} />
              )}
              <div className="flex gap-4 items-center justify-center mb-20">
                <MediaModal
                  type={evidence.type}
                  url={
                    evidence.type === "IMAGE"
                      ? getImageUrlWithPolicy(evidence.url, security)
                      : evidence.url
                  }
                />

                {isAuthorized && (
                  <DeleteEvidenceForm evidenceId={evidence.id} />
                )}
              </div>
            </div>
          ))}
          {isAuthorized &&
            evidences.length < treeLogicConfig.maxNoOfTreeEvidences && (
              <AddEvidenceTabs treeId={treeId} />
            )}
        </div>
      </CredenzaContent>
    </Credenza>
  );
}
