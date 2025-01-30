"use client";

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingAnimation } from "@/components/common/loading-animation";
import LoginModal from "@/components/auth/login-modal";
import { Button } from "@/components/ui/button";
import Subscribe from "@/components/payments/subscribe";

type States =
  | "loading"
  | "unauthenticated"
  | "user-not-found"
  | "user-found"
  | "lowpoints";

type FormStatesProp = { states: States };

type RenderedStates = Record<
  States,
  { children: ReactNode; description: string }
>;

const RefreshButton = () => {
  const router = useRouter();
  return <Button onClick={() => router.refresh()}>Refresh Page</Button>;
};

const renderedStates: RenderedStates = {
  "user-found": { children: null, description: "" },
  loading: { children: <LoadingAnimation />, description: "Loading..." },
  lowpoints: {
    children: <Subscribe />,
    description: "You dont have enough MitiMara points to continue",
  },
  unauthenticated: {
    children: <LoginModal />,
    description: "Please Sign in to continue.",
  },
  "user-not-found": {
    children: <RefreshButton />,
    description: "Your Location is needed to continue.",
  },
};

const FormStates = ({ states }: FormStatesProp) => {
  const { children, description } = renderedStates[states];

  return (
    <Card className="mb-16 max-w-fit">
      <CardHeader>
        <CardTitle>Create Local Bounty Hunt 🏆</CardTitle>
        <CardDescription>
          Set up a Local Bounty Hunt on MitiMara! Specify location, radius,
          bounty, and duration to reward tree planters and verifiers with Pi
          tokens. 🌳💚
        </CardDescription>
      </CardHeader>
      <CardContent>{description}</CardContent>
      <CardFooter>{children}</CardFooter>
    </Card>
  );
};

export default FormStates;
