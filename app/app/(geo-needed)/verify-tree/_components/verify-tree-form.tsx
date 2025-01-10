"use client";

import { Security } from "filestack-js";
import { SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NearbyTreeReturnType } from "@/lib/validations/tree";
import TreeModalContainer from "./tree-modal-container";

type VerifyTreeFormProps = {
  nearbyTree: NearbyTreeReturnType;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setVideoUrl: (value: SetStateAction<string>) => void;
  videoUrl: string;
  isAuthentic: boolean | null;
  setIsAuthentic: (value: SetStateAction<boolean | null>) => void;
  setAdditionalInfo: (value: SetStateAction<string>) => void;
  additionalInfo: string;
  security: Security;
};

const VerifyTreeForm = ({
  nearbyTree,
  additionalInfo,
  setAdditionalInfo,
  handleSubmit,
  setVideoUrl,
  videoUrl,
  isAuthentic,
  setIsAuthentic,
  security,
}: VerifyTreeFormProps) => {
  if (!nearbyTree) {
    return null;
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Verify Tree</CardTitle>
        <CardDescription>
          Verify the tree accurately to avoid losing points. Refer to the help
          icons below for more verification info. 🌳
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TreeModalContainer nearbyTree={nearbyTree} security={security} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Is the tree authentic?</Label>
            <div className="flex space-x-4 sm:justify-center">
              <Button
                type="button"
                className="w-full sm:w-2/5"
                variant={isAuthentic === true ? "success" : "outline"}
                onClick={() => setIsAuthentic(true)}
              >
                Real
              </Button>
              <Button
                type="button"
                className="w-full sm:w-2/5"
                variant={isAuthentic === false ? "destructive" : "outline"}
                onClick={() => setIsAuthentic(false)}
              >
                Fake
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL (optional)</Label>
            <Input
              id="videoUrl"
              type="url"
              placeholder="https://youtube.com/..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Extra Information (Optional)</Label>
            <Textarea
              id="additionalInfo"
              placeholder="Provide any additional details about your verification..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            type="submit"
            disabled={isAuthentic === null}
          >
            Submit Verification
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VerifyTreeForm;
