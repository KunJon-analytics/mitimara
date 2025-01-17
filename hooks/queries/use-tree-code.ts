import { skipToken, useQuery } from "@tanstack/react-query";

type Params = {
  accessToken?: string;
  treeId: string;
};

function useTreeCode({ accessToken, treeId }: Params) {
  const { status, data, isLoading } = useQuery({
    queryKey: ["nearby-tree"],
    refetchInterval: 1000 * 15 * 10,
    queryFn: accessToken
      ? async () => {
          const response = await fetch(
            `/api/trees/${treeId}/code?token=${accessToken}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const json = await response.json();

          return json as {
            code: string;
          } | null;
        }
      : skipToken,
  });

  return { status, data, isLoading };
}

export default useTreeCode;
