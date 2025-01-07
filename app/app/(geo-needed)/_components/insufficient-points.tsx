"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type InsufficientPointsProps = {
  title: string;
  bodyText: string;
  pointsBalance: number;
  minPoints: number;
};

const InsufficientPoints = ({
  minPoints,
  pointsBalance,
  title,
  bodyText,
}: InsufficientPointsProps) => {
  const router = useRouter();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{bodyText}</p>
        {`Oops! You need more points to ${bodyText}. 🌳 You have ${pointsBalance} points, but you need ${minPoints} points.`}
      </CardContent>
      <CardFooter>
        <Button onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InsufficientPoints;
