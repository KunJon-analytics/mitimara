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
import {
  getTreeStageColor,
  getUIStatus,
  isTreeVerficationEnded,
} from "@/lib/tree/utils";
import { $Enums } from "@prisma/client";
import {
  treeVerifications,
  verificationNotStartedStatus,
} from "@/lib/tree/constants";
import { Icons } from "@/components/common/icons";
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
  treeStatus: $Enums.TreeStatus;
  additionalInfo: string;
  evidences: Evidence[];
  security: Security;
  treeIsAuthentic: boolean;
}

export default function TreeInfoCard({
  treeId,
  planter,
  datePlanted,
  treeStatus,
  additionalInfo,
  evidences,
  security,
  treeIsAuthentic,
}: TreeInfoCardProps) {
  const verifStarted = !verificationNotStartedStatus.includes(treeStatus);
  const verifEnded = isTreeVerficationEnded(treeStatus);
  const treeVerification = !verifEnded
    ? "N/A"
    : treeIsAuthentic
    ? "REAL"
    : "FAKE";
  const treesverifStatus = treeVerifications[treeVerification];
  const VericationIcon = Icons[treesverifStatus.icon];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Tree #{" "}
          <span className="text-sm text-primary">{treeId.slice(-6)}...</span>
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
        <div className="flex items-center space-x-2">
          <Badge variant={getTreeStageColor(treeStatus)}>
            <Leaf className="mr-1 h-3 w-3" />
            {getUIStatus(treeStatus)}
          </Badge>
          <Badge variant={treesverifStatus.badgeVariant}>
            <VericationIcon className="mr-1 h-3 w-3" />
            {treeVerification}
          </Badge>
        </div>
        <AdditionalInfo
          verificationStarted={verifStarted}
          initialInfo={additionalInfo}
          planterId={planter.id}
          treeId={treeId}
        />
      </CardContent>
      <CardFooter>
        <EvidenceModal
          verificationStarted={verifStarted}
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
