"use client";

import { BellRing, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useCurrentLocation from "@/components/providers/location-provider";

type LocationErrorCardProps = React.ComponentProps<typeof Card> & {
  error: string;
};

const LocationErrorCard = ({
  className,
  error,
  ...props
}: LocationErrorCardProps) => {
  const {
    state: { loading },
  } = useCurrentLocation();
  const router = useRouter();

  return (
    <Card className={cn("w-[380px]", className)} {...props}>
      <CardHeader>
        <CardTitle>Location Error</CardTitle>
        <CardDescription>
          {loading
            ? "loading... (you may need to enable permissions)"
            : "There was an error while fetching your location."}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <BellRing />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{error}</p>
            {!loading && (
              <p className="text-sm text-muted-foreground">
                Try to fetch location again.
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={loading}
          onClick={() => router.refresh()}
        >
          <MapPin /> Get Location
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LocationErrorCard;
