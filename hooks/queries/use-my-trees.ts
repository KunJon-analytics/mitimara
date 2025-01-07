import { skipToken, useQuery } from "@tanstack/react-query";

import { UnverifiedTrees } from "@/lib/validations/tree";

function useMyTrees(userId: string) {
  const { status, data, isLoading } = useQuery({
    queryKey: ["my-trees", userId],
    refetchInterval: 1000 * 60 * 10,
    queryFn: userId
      ? async () => {
          const response = await fetch(`/api/trees?userid=${userId}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const json = await response.json();

          return json as UnverifiedTrees;
        }
      : skipToken,
  });

  return { status, data, isLoading };
}

export default useMyTrees;
