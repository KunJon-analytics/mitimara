import { ReactNode } from "react";

import { BountyFormProvider } from "./_components/bounty-form-context";

type BountyFormLayoutProps = { children: ReactNode };

const BountyFormLayout = ({ children }: BountyFormLayoutProps) => {
  return <BountyFormProvider>{children}</BountyFormProvider>;
};

export default BountyFormLayout;
