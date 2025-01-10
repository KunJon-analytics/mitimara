import { skipToken, useQuery } from "@tanstack/react-query";

import { NearbyTreeReturnType } from "@/lib/validations/tree";

type Params = {
  accessToken: string;
  latitude: number | null;
  longitude: number | null;
};

function useFindNearbyTree({ accessToken, latitude, longitude }: Params) {
  const userFound = latitude !== null && longitude !== null;

  const { status, data, isLoading } = useQuery({
    queryKey: ["nearby-tree"],
    refetchInterval: 1000 * 15 * 10,
    queryFn:
      accessToken && userFound
        ? async () => {
            const response = await fetch(
              `/api/trees/find-nearby?token=${accessToken}&lat=${latitude}&lng=${longitude}`
            );
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            const json = await response.json();

            return json as NearbyTreeReturnType;
          }
        : skipToken,
  });

  return { status, data, isLoading };
}

export default useFindNearbyTree;
