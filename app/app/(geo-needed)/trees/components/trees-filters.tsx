"use client";

import { MapPin, Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { $Enums } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import useCurrentLocation from "@/components/providers/location-provider";
import { useMapSearchParams } from "@/hooks/use-map-search-params";
import { SortBy } from "../searchParams";

export function TreesFilters() {
  const { searchParams, updateSearchParams, isLoading } = useMapSearchParams();

  const {
    state: { latitude: currentLat, longitude: currentLng },
  } = useCurrentLocation();

  const hasLocation =
    searchParams.latitude !== null && searchParams.longitude !== null;

  const handleUseCurrentLocation = async () => {
    if (currentLat === null || currentLng === null) {
      toast.error("Location Error", {
        description:
          "Unable to access your location. Please enable location services.",
      });
      return;
    }

    updateSearchParams((prevParams) => {
      return {
        ...prevParams,
        latitude: currentLat,
        longitude: currentLng,
        sortBy: "distance",
      };
    });

    toast.success("Location Updated", {
      description: "Map centered to the tree closest to you",
    });
  };

  const clearLocation = () => {
    updateSearchParams((prevParams) => {
      return {
        ...prevParams,
        latitude: null,
        longitude: null,
        sortBy: prevParams.sortBy === "distance" ? "newest" : prevParams.sortBy,
      };
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="font-medium">Filtering...</span>
              </>
            ) : (
              <>
                <Filter className="h-4 w-4" />
                <span className="font-medium">Filters:</span>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-3 flex-1">
            <Select
              value={searchParams.status ?? undefined}
              onValueChange={(value: $Enums.TreeStatus) =>
                updateSearchParams((prevParams) => {
                  return {
                    ...prevParams,
                    status: value,
                  };
                })
              }
              disabled={isLoading}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLANTED">All statuses</SelectItem>
                <SelectItem value="VERIFYING">Needs Verification</SelectItem>
                <SelectItem value="MATURED">Already Verified</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={searchParams.sortBy}
              disabled={isLoading}
              onValueChange={(value: SortBy) =>
                updateSearchParams((prevParams) => {
                  return {
                    ...prevParams,
                    sortBy: value,
                  };
                })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="distance" disabled={!hasLocation}>
                  Distance {!hasLocation && "(location required)"}
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              {!hasLocation ? (
                <Button
                  variant="outline"
                  onClick={handleUseCurrentLocation}
                  disabled={isLoading}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Use My Location
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={clearLocation}
                  disabled={isLoading}
                >
                  Clear Location
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
