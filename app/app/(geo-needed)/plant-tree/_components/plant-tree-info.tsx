import React from "react";
import { Info } from "lucide-react";

import ContentContainer from "@/components/content/content-container";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { siteConfig } from "@/config/site";
import Summary from "@/app/(content)/blog/how-to-plant-a-three/_component/planting-summary.mdx";

const PlantTreeInfo = () => {
  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <Info className="animate-pulse text-primary" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{siteConfig.name} Planting Guide</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>
          <ContentContainer>
            <Summary />
          </ContentContainer>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
};

export default PlantTreeInfo;
