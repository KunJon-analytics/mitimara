"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

import {
  CreateBountySchema,
  createDefaultValues,
  FormStep,
} from "@/lib/validations/local-bounty/create";
import useCurrentLocation from "@/components/providers/location-provider";
import useCurrentSession from "@/components/providers/session-provider";

// A "provider" is used to encapsulate only the
// components that needs the state in this context

type BountyFormContextType = {
  formState: CreateBountySchema;
  setFormState: Dispatch<SetStateAction<CreateBountySchema>>;
  formStep: FormStep;
  setFormStep: Dispatch<SetStateAction<FormStep>>;
};

type BountyFormProviderProps = {
  children: ReactNode;
};

export const BountyFormContext = createContext<BountyFormContextType | null>(
  null
);

export function BountyFormProvider({ children }: BountyFormProviderProps) {
  const {
    state: { latitude, longitude },
  } = useCurrentLocation();
  const { accessToken } = useCurrentSession();

  const [formStep, setFormStep] = useState<FormStep>("location");
  const [formState, setFormState] = useState<CreateBountySchema>({
    ...createDefaultValues,
    centerLatitude: latitude === null ? 0 : latitude,
    centerLongitude: longitude === null ? 0 : longitude,
    accessToken,
  });
  return (
    <BountyFormContext.Provider
      value={{ formState, setFormState, formStep, setFormStep }}
    >
      {children}
    </BountyFormContext.Provider>
  );
}

const useBountyForm = () => {
  const bountyFormContext = useContext(BountyFormContext);

  if (!bountyFormContext) {
    throw new Error(
      "useClient has to be used within <BountyFormContext.Provider>"
    );
  }

  return bountyFormContext;
};

export default useBountyForm;
