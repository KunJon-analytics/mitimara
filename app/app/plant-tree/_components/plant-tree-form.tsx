"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createTree } from "@/actions/tree/create-tree";
import { Button } from "@/components/ui/button";

type PlantTreeFormProps = { latitude: number; longitude: number };

const PlantTreeForm = ({ latitude, longitude }: PlantTreeFormProps) => {
  const router = useRouter();

  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);

    // TODO: Replace 'user-id' with actual user ID from authentication
    const result = await createTree(latitude, longitude, "user-id");
    setIsConfirming(false);

    if (result.success) {
      router.push(`/app/tree/${result.treeId}`);
    } else {
      // TODO: Handle error (e.g., show error message to user)
      console.error(result.error);
    }
  };

  return (
    <Button
      onClick={handleConfirm}
      disabled={isConfirming}
      className="w-full sm:w-auto"
    >
      {isConfirming ? "Confirming..." : "Confirm Tree Location"}
    </Button>
  );
};

export default PlantTreeForm;
