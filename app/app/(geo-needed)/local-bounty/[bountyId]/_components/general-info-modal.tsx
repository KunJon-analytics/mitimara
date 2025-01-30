"use client";

import { useEffect, useState } from "react";
import { Calendar, Coins, MapPin, Target } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaBody,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { cn } from "@/lib/utils";
import { ButtonProps, Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BountyHuntModalParam } from "@/lib/validations/local-bounty/service";

type GeneralInfoModalProps = ButtonProps & {
  localHunt: BountyHuntModalParam;
};

const GeneralInfoModal = ({
  className,
  localHunt,
  ...props
}: GeneralInfoModalProps) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let toastId: number | string;

    if (pathname === "/app/verify-tree") {
      toastId = toast.info(`Tree in Bounty Hunt`, {
        description: `The tree is part of a bounty hunt contest. Verify now and stand a chance to win more Pi tokens!`,
      });
    }

    return () => {
      toast.dismiss(toastId);
    };
  }, [pathname, router]);

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button
          size={"icon"}
          variant={"ghost"}
          className={cn(className)}
          {...props}
          onClick={() => setOpen(true)}
        >
          <Target className="animate-pulse text-primary h-4 w-4" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Bounty Hunt Contest Details 🏆</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">
                  {localHunt.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {localHunt.description}
              </p>

              <Separator />

              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-xs text-muted-foreground">
                    {localHunt.centerLatitude.toFixed(6)},{" "}
                    {localHunt.centerLongitude.toFixed(6)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Radius: {localHunt.radius} km
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(localHunt.startDate, {
                      addSuffix: true,
                    })}{" "}
                    -{" "}
                    {formatDistanceToNow(localHunt.endDate, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coins className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Total Bounty</p>
                </div>
                <p className="text-lg font-bold">π{localHunt.totalBounty}</p>
              </div>
            </CardContent>
          </Card>
        </CredenzaBody>

        <CredenzaFooter>
          <Button asChild>
            <Link href={`/app/local-bounty/${localHunt.id}`}>
              View Bounty Hunt
            </Link>
          </Button>
          <CredenzaClose asChild>
            <Button variant={"destructive"} type="button">
              Close
            </Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default GeneralInfoModal;
