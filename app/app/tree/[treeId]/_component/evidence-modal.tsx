"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { $Enums } from "@prisma/client";

type Evidence = {
  id: string;
  type: $Enums.MediaType;
  url: string;
};

type EvidenceModalProps = {
  treeId: string;
  evidences: Evidence[];
  isPlanter: boolean;
};

export function EvidenceModal({
  treeId,
  evidences,
  isPlanter,
}: EvidenceModalProps) {
  const [newEvidenceUrl, setNewEvidenceUrl] = useState("");
  const [newEvidenceType, setNewEvidenceType] =
    useState<$Enums.MediaType>("IMAGE");

  const handleAddEvidence = () => {
    // onAddEvidence({ type: newEvidenceType, url: newEvidenceUrl });
    setNewEvidenceUrl("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Evidence</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tree Evidence</DialogTitle>
          <DialogDescription>
            View and manage evidence for this tree.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {evidences.map((evidence) => (
            <div key={evidence.id} className="flex items-center gap-4">
              {evidence.type === "IMAGE" ? (
                <img
                  src={evidence.url}
                  alt="Tree evidence"
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <video
                  src={evidence.url}
                  className="w-20 h-20 object-cover rounded"
                  controls
                />
              )}
              <a
                href={evidence.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {evidence.type === "IMAGE" ? "View Picture" : "View Video"}
              </a>
            </div>
          ))}
          {isPlanter && (
            <div className="grid gap-2">
              <Label htmlFor="evidenceUrl">Add New Evidence</Label>
              <Input
                id="evidenceUrl"
                value={newEvidenceUrl}
                onChange={(e) => setNewEvidenceUrl(e.target.value)}
                placeholder="Enter URL for picture or video"
              />
              <div className="flex gap-2">
                <Button
                  variant={newEvidenceType === "IMAGE" ? "default" : "outline"}
                  onClick={() => setNewEvidenceType("IMAGE")}
                >
                  Picture
                </Button>
                <Button
                  variant={newEvidenceType === "VIDEO" ? "default" : "outline"}
                  onClick={() => setNewEvidenceType("VIDEO")}
                >
                  Video
                </Button>
              </div>
              <Button onClick={handleAddEvidence} disabled={!newEvidenceUrl}>
                Add Evidence
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
