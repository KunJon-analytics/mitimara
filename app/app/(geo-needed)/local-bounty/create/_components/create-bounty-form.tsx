"use client";

import useCurrentSession from "@/components/providers/session-provider";
import useCurrentLocation from "@/components/providers/location-provider";
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import useBountyForm from "./bounty-form-context";
import { FormA } from "./form-a";
import { FormB } from "./form-b";
import { FormC } from "./form-c";
import FormStates from "./form-states";
import { Stepper } from "./stepper";
import useProfile from "@/hooks/queries/use-profile";
import { localBountyLogicConfig } from "@/config/site";

export function CreateBountyForm() {
  const { session } = useCurrentSession();
  const { data: profile } = useProfile(session.id);
  const {
    state: { latitude, longitude, loading, error },
  } = useCurrentLocation();
  const { formStep } = useBountyForm();

  const userFound = longitude !== null && latitude !== null;

  if (!session.isLoggedIn) {
    return <FormStates states="unauthenticated" />;
  }

  if (loading) {
    return <FormStates states="loading" />;
  }

  if (!userFound || error) {
    return <FormStates states="user-not-found" />;
  }

  if (!profile || profile.points < localBountyLogicConfig.minCreatorPoints) {
    return <FormStates states="lowpoints" />;
  }

  return (
    <Card className="mb-16 max-w-fit sm:max-w-lg">
      <CardHeader>
        <CardTitle>Create Local Bounty Hunt 🏆</CardTitle>
        <CardDescription>
          Set up a Local Bounty Hunt on MitiMara! Specify location, radius,
          bounty, and duration to reward tree planters and verifiers with Pi
          tokens. 🌳💚
        </CardDescription>
      </CardHeader>
      <Stepper className="p-4" currentStep={formStep} />
      <CardContent>
        {formStep === "location" && <FormA />}
        {formStep === "information" && <FormB />}
        {formStep === "summary" && <FormC />}
      </CardContent>
    </Card>
  );
}
