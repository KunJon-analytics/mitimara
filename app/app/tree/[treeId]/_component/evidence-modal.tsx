"use client";

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
import DeleteEvidenceForm from "./delete-evidence-form";
import AddEvidenceTabs from "./add-evidence-tabs";
import { getImageUrlWithPolicy } from "@/lib/utils";

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
  const { session } = useCurrentSession();
  const isPlanter = session.id === planterId;
  const isAuthorized = isPlanter && !verificationStarted;

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button variant="outline">View Evidence</Button>
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
                // change to youtube component
                <VideoPlayer url={evidence.url} height={160} width={160} />
              )}
              <a
                href={
                  evidence.type === "VIDEO"
                    ? evidence.url
                    : getImageUrlWithPolicy(evidence.url, security)
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {evidence.type === "IMAGE" ? "View Picture" : "View Video"}
              </a>
              {isAuthorized && <DeleteEvidenceForm evidenceId={evidence.id} />}
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
