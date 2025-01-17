"use client";

import type { Security } from "filestack-js";
import type { Dispatch, SetStateAction } from "react";

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
import {
  NearbyTreeReturnType,
  VerifyTreeFormState,
} from "@/lib/validations/tree";
import TreeModalContainer from "./tree-modal-container";

type VerifyTreeFormProps = {
  nearbyTree: NearbyTreeReturnType;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  formState: VerifyTreeFormState;
  setFormState: Dispatch<SetStateAction<VerifyTreeFormState>>;
  security: Security;
};

const VerifyTreeForm = ({
  nearbyTree,
  formState,
  setFormState,
  handleSubmit,
  security,
}: VerifyTreeFormProps) => {
  if (!nearbyTree) {
    return null;
  }

  const { additionalInfo, isAuthentic, videoUrl, code } = formState;

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
            <Label htmlFor="code">Tree Code</Label>
            <Input
              id="code"
              placeholder="Input unique tree code shown on tree evidence media"
              value={code}
              onChange={(e) =>
                setFormState((prevValue) => ({
                  ...prevValue,
                  code: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Is the tree authentic?</Label>
            <div className="flex space-x-4 sm:justify-center">
              <Button
                type="button"
                className="w-full sm:w-2/5"
                variant={isAuthentic === true ? "success" : "outline"}
                onClick={() =>
                  setFormState((prevValue) => ({
                    ...prevValue,
                    isAuthentic: true,
                  }))
                }
              >
                Real
              </Button>
              <Button
                type="button"
                className="w-full sm:w-2/5"
                variant={isAuthentic === false ? "destructive" : "outline"}
                onClick={() =>
                  setFormState((prevValue) => ({
                    ...prevValue,
                    isAuthentic: false,
                  }))
                }
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
              onChange={(e) =>
                setFormState((prevValue) => ({
                  ...prevValue,
                  videoUrl: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Extra Information (Optional)</Label>
            <Textarea
              id="additionalInfo"
              placeholder="Provide any additional details about your verification..."
              value={additionalInfo}
              onChange={(e) =>
                setFormState((prevValue) => ({
                  ...prevValue,
                  additionalInfo: e.target.value,
                }))
              }
            />
          </div>
          <Button
            className="w-full"
            type="submit"
            disabled={isAuthentic === null || !code}
          >
            Submit Verification
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VerifyTreeForm;
