"use client";

import { TreePine } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useTreeCode from "@/hooks/queries/use-tree-code";
import useCurrentSession from "@/components/providers/session-provider";

type TreeCodeProps = { treeId: string };

const TreeCode = ({ treeId }: TreeCodeProps) => {
  const { accessToken } = useCurrentSession();

  const { data } = useTreeCode({ treeId, accessToken });

  if (!data) {
    return null;
  }

  return (
    <Alert>
      <TreePine className="h-4 w-4" />
      <AlertTitle>Tree Code!</AlertTitle>
      <AlertDescription className="text-primary">{data.code}</AlertDescription>
    </Alert>
  );
};

export default TreeCode;
