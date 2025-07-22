"use client";

import { LogIn } from "lucide-react";
import { ReactNode } from "react";

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
import { LoginParams } from "@/lib/validations/session";
import useCurrentSession from "../providers/session-provider";
import { Button, ButtonProps } from "../ui/button";
import { LoadingAnimation } from "../common/loading-animation";

type LoginModalProps = ButtonProps & LoginParams & { buttonText?: ReactNode };

const LoginModal = ({
  className,
  redirect,
  referral,
  buttonText,
  ...props
}: LoginModalProps) => {
  const { isPending, login, session } = useCurrentSession();

  const renderedText =
    props.size === "icon" ? <LogIn /> : buttonText ?? "Get Started";

  const onClick = async () => {
    await login({ redirect, referral });
  };

  if (session.isLoggedIn) {
    return null;
  }

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button className={cn("rounded-full", className)} {...props}>
          {renderedText}
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
