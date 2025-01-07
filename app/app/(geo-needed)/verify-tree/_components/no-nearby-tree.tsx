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

type NoNearbyTreeProps = {
  title: string;
  description: string;
  showAuth: boolean;
};

const NoNearbyTree = ({ title, description, showAuth }: NoNearbyTreeProps) => {
  const router = useRouter();

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        {!showAuth ? (
          <Button onClick={() => router.push("/app/plant-tree")}>
            Plant a Tree
          </Button>
        ) : (
          <LoginModal />
        )}
      </CardFooter>
    </Card>
  );
};

export default NoNearbyTree;
