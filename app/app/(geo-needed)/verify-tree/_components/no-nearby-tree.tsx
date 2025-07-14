"use client";

import { useRouter } from "next/navigation";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoginModal from "@/components/auth/login-modal";
import useCurrentLocation from "@/components/providers/location-provider";
import NearestTreesButton from "./nearest-trees-button";

type NoNearbyTreeProps = {
  title: string;
  description: string;
  showAuth: boolean;
};

const NoNearbyTree = ({ title, description, showAuth }: NoNearbyTreeProps) => {
  const router = useRouter();
  const {
    state: { latitude, longitude },
  } = useCurrentLocation();

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col md:flex-row gap-2 justify-between">
        {!showAuth ? (
          <>
            <NearestTreesButton
              buttontext="View Unverified Trees Nearby"
              searchParams={{
                latitude,
                longitude,
                sortBy: latitude && longitude ? "distance" : "newest",
                status: "VERIFYING",
              }}
              variant={"secondary"}
              className="w-full"
            />

            <Button
              className="w-full"
              onClick={() => router.push("/app/plant-tree")}
            >
              Plant a Tree
            </Button>
          </>
        ) : (
          <LoginModal />
        )}
      </CardFooter>
    </Card>
  );
};

export default NoNearbyTree;
