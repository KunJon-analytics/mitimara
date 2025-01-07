"use client";

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
  latitude: number;
  longitude: number;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setVideoUrl: (value: SetStateAction<string>) => void;
  videoUrl: string;
  isAuthentic: boolean | null;
  setIsAuthentic: (value: SetStateAction<boolean | null>) => void;
  setAdditionalInfo: (value: SetStateAction<string>) => void;
  additionalInfo: string;
};

const VerifyTreeForm = ({
  nearbyTree,
  additionalInfo,
  setAdditionalInfo,
  latitude,
  longitude,
  handleSubmit,
  setVideoUrl,
  videoUrl,
  isAuthentic,
  setIsAuthentic,
}: VerifyTreeFormProps) => {
  if (!nearbyTree) {
    return null;
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Verify Tree</CardTitle>
        <CardDescription>
          Please verify the tree planted by {nearbyTree.planter.username}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TreeModalContainer
          latitude={latitude}
          longitude={longitude}
          nearbyTree={nearbyTree}
        />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL</Label>
            <Input
              id="videoUrl"
              type="url"
              placeholder="https://youtube.com/..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Is the tree authentic?</Label>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={isAuthentic === true ? "default" : "outline"}
                onClick={() => setIsAuthentic(true)}
              >
                Real
              </Button>
              <Button
                type="button"
                variant={isAuthentic === false ? "default" : "outline"}
                onClick={() => setIsAuthentic(false)}
              >
                Fake
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">
              Additional Information (Optional)
            </Label>
            <Textarea
              id="additionalInfo"
              placeholder="Provide any additional details about your verification..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isAuthentic === null}>
            Submit Verification
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VerifyTreeForm;
