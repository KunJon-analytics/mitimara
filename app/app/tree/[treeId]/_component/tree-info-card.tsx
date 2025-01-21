import { formatDistanceToNow } from "date-fns";
import { Leaf, Calendar, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TreeStageName } from "@/lib/tree/constants";
import { getTreeStageColor } from "@/lib/tree/utils";
import { $Enums } from "@prisma/client";
import { AdditionalInfo } from "./additional-info";
import { EvidenceModal } from "./evidence-modal";

type Security = { policy: string; signature: string };

type Evidence = {
  id: string;
  type: $Enums.MediaType;
  url: string;
};

interface TreeInfoCardProps {
  treeId: string;
  planter: { id: string; username: string };
  datePlanted: Date;
  treeStage: TreeStageName;
  additionalInfo: string;
  evidences: Evidence[];
  security: Security;
}

export default function TreeInfoCard({
  treeId,
  planter,
  datePlanted,
  treeStage,
  additionalInfo,
  evidences,
  security,
}: TreeInfoCardProps) {
  const verificationStarted = treeStage !== "Planted" && treeStage !== "Listed";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Tree #{" "}
          <span className="text-sm text-primary">{treeId.slice(0, 6)}...</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span className="text-sm">{planter.username}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">
            {formatDistanceToNow(datePlanted, { addSuffix: true })}
          </span>
        </div>
        <Badge variant={getTreeStageColor(treeStage)}>
          <Leaf className="mr-1 h-3 w-3" />
          {treeStage}
        </Badge>
        <AdditionalInfo
          verificationStarted={verificationStarted}
          initialInfo={additionalInfo}
          planterId={planter.id}
          treeId={treeId}
        />
      </CardContent>
      <CardFooter>
        <EvidenceModal
          verificationStarted={verificationStarted}
          treeId={treeId}
          evidences={evidences}
          planterId={planter.id}
          fileSecurity={security}
          className="w-full"
        />
      </CardFooter>
    </Card>
  );
}
