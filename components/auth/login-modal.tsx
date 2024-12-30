"use client";

import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import useCurrentSession from "../providers/session-provider";
import { Button, ButtonProps } from "../ui/button";
import { LoadingAnimation } from "../common/loading-animation";

const LoginModal = ({ className, ...props }: ButtonProps) => {
  const { isPending, login } = useCurrentSession();

  const onClick = async () => {
    await login();
  };

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button className={cn("rounded-full", className)} {...props}>
          Get Started
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Login</CredenzaTitle>
          <CredenzaDescription>
            Sign in to {siteConfig.name}
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          Join us in making the planet greener! Sign in with your Pi Browser to
          start planting trees and earning rewards.
        </CredenzaBody>
        <CredenzaFooter>
          <Button onClick={onClick} disabled={isPending}>
            {isPending ? <LoadingAnimation /> : "Sign In"}
          </Button>
          <CredenzaClose asChild>
            <Button variant={"destructive"}>Close</Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default LoginModal;
