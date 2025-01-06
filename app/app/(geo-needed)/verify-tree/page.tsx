"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitVerification } from "@/actions/tree/submit-verification";
import useCurrentSession from "@/components/providers/session-provider";
import LoginModal from "@/components/auth/login-modal";
import useCurrentLocation from "@/components/providers/location-provider";
import useFindNearbyTree from "@/hooks/queries/use-find-nearby-tree";
import { treeLogicConfig } from "@/config/site";
import LocationErrorCard from "../_components/location-error-card";

export const dynamic = "force-dynamic";

export default function VerifyTree() {
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthentic, setIsAuthentic] = useState<boolean | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState("");

  const {
    location: { latitude, longitude },
    error,
  } = useCurrentLocation();

  const router = useRouter();

  const { accessToken, session } = useCurrentSession();
  const { data: nearbyTree, status } = useFindNearbyTree({
    accessToken,
    latitude,
    longitude,
  });

  const userLocated = latitude !== null && longitude !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nearbyTree || isAuthentic === null) return;

    setIsLoading(true);
    // TODO: Replace 'current-user-id' with actual logged-in user ID
    const result = await submitVerification({
      treeId: nearbyTree.id,
      type: "VIDEO",
      accessToken,
      isAuthentic,
      url: videoUrl,
      additionalInfo,
    });
    setIsLoading(false);

    if (result.success) {
      toast.success("Verification submitted", {
        description: "Thank you for verifying this tree!",
      });

      router.refresh();
    } else {
      toast.error("Error", {
        description: result.error,
      });
    }
  };

  if (!session.isLoggedIn) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Not Logged In</CardTitle>
          <CardDescription>
            Please log in to verify trees within{" "}
            {treeLogicConfig.maxVerifierDistance}km of your location.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <LoginModal />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return <LocationErrorCard error={error} />;
  }

  if (!userLocated) {
    return <div className="text-center p-4">Loading user Location...</div>;
  }

  if (isLoading || status === "pending") {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (!nearbyTree) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>No Trees Nearby</CardTitle>
          <CardDescription>
            There are no unverified trees within 2km of your location.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push("/app/plant-tree")}>
            Plant a Tree
          </Button>
        </CardFooter>
      </Card>
    );
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
          <Button type="submit" disabled={isLoading || isAuthentic === null}>
            Submit Verification
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
