"use client";

import { Calendar, Info, MapPin } from "lucide-react";
import Link from "next/link";

import useCurrentSession from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import useMyTrees from "@/hooks/queries/use-my-trees";
import { formatDistanceToNow } from "date-fns";

const MyUnverifiedTrees = () => {
  const { session } = useCurrentSession();
  const { data: trees } = useMyTrees(session.id);

  if (!trees || trees.length === 0) {
    return <p>You haven{"'"}t planted any trees that need verification yet.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {trees.map((tree) => (
        <Card key={tree.id}>
          <CardHeader>
            <CardTitle>Tree #{tree.id.slice(-6)}</CardTitle>
            <CardDescription>
              Planted {formatDistanceToNow(tree.createdAt, { addSuffix: true })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-2">
              <MapPin className="mr-2 h-4 w-4" />
              <span>
                {tree.latitude.toFixed(6)}, {tree.longitude.toFixed(6)}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>
                {formatDistanceToNow(tree.createdAt, { addSuffix: true })}
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/app//tree/${tree.id}`}>
                <Info className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default MyUnverifiedTrees;
