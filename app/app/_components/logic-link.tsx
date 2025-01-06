"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useCurrentSession from "@/components/providers/session-provider";
import useProfile from "@/hooks/queries/use-profile";
import { LoadingAnimation } from "@/components/common/loading-animation";

type LogicLinkProps = {
  minPoints: number;
  title: string;
  bodyText: string;
  link: string;
  buttonText: string;
};

const LogicLink = ({
  bodyText,
  buttonText,
  link,
  minPoints,
  title,
}: LogicLinkProps) => {
  const router = useRouter();

  const { session } = useCurrentSession();
  const { data: stats, status } = useProfile(session.id);

  if (status === "pending") {
    return <LoadingAnimation />;
  }

  if (status === "error" || !stats) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{bodyText}</p>
        {stats.points < minPoints ? (
          `Oops! You need more points to ${bodyText}. 🌳 You have ${stats.points} points, but you need ${minPoints} points.`
        ) : (
          <Button onClick={() => router.push(link)}>{buttonText}</Button>
        )}
      </CardContent>
    </Card>
  );
};

export default LogicLink;
