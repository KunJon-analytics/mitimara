"use client";

import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const ComingSoonButton = () => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="bg-white/80 dark:bg-background/80"
      onClick={() => toast.info("Coming Soon...")}
    >
      <ExternalLink className="w-4 h-4 mr-2" />
      View Code
    </Button>
  );
};

export default ComingSoonButton;
