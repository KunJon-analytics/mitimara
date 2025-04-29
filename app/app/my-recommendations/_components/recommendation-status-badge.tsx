import { AlertCircle, Clock, Leaf } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { $Enums } from "@prisma/client";

function RecommendationStatusBadge({
  status,
}: {
  status: $Enums.TreeRecommendationStatus;
}) {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="secondary" className="flex items-center">
          <Clock className="mr-1 h-3 w-3" /> Processing
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge variant="success" className="flex items-center">
          <Leaf className="mr-1 h-3 w-3" /> Ready
        </Badge>
      );
    case "FAILED":
      return (
        <Badge variant="destructive" className="flex items-center">
          <AlertCircle className="mr-1 h-3 w-3" /> Failed
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
}

export default RecommendationStatusBadge;
