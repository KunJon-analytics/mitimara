import React from "react";
import { CircleHelp } from "lucide-react";

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
import Summary from "@/content/blog/snippets/planting-summary.mdx";

const PlantTreeInfo = () => {
  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <CircleHelp className="animate-pulse text-warning" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{siteConfig.name} Tree Planting Guide</CredenzaTitle>
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
