"use client";

import { Calendar, Info, MapPin } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

type MyTreesProps = { filter: "unverified" | "fake" };

const MyTrees = ({ filter }: MyTreesProps) => {
  const { session } = useCurrentSession();
  const { data: trees } = useMyTrees(session.id);

  if (!trees || trees.length === 0) {
    return <NoTrees filter={filter} />;
  }

  const displayedTrees = trees.filter((tree) => {
    if (filter === "fake") {
      return tree.status === "MATURED";
    }
    return tree.status !== "MATURED";
  });

  if (displayedTrees.length === 0) {
    return <NoTrees filter={filter} />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {displayedTrees.map((tree) => (
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

const NoTrees = ({ filter }: MyTreesProps) => {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You have no {filter} trees that need your action.
      </AlertDescription>
    </Alert>
  );
};

export default MyTrees;
