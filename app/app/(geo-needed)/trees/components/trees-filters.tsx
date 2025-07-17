"use client";

import { MapPin, Filter, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { $Enums } from "@prisma/client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCurrentLocation from "@/components/providers/location-provider";
import { useMapSearchParams } from "@/hooks/use-map-search-params";
import { Badge } from "@/components/ui/badge";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { SortBy } from "../searchParams";

export function TreesFilters() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    searchParams: {
      latitude,
      longitude,
      status: currentStatus,
      sortBy: currentSort,
    },
    updateSearchParams,
    isLoading,
  } = useMapSearchParams();

  const {
    state: { latitude: currentLat, longitude: currentLng },
  } = useCurrentLocation();

  const hasLocation = latitude !== null && longitude !== null;

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

    setIsOpen(false);

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
    setIsOpen(false);
  };

  const clearAllFilters = () => {
    updateSearchParams(null);
    setIsOpen(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (currentStatus && currentStatus !== "PLANTED") count++;
    if (currentSort !== "newest") count++;
    if (hasLocation) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2" />
              Filtering...
            </>
          ) : (
            <>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </>
          )}
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 h-5 min-w-5 rounded-full font-mono tabular-nums"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle>Filter & Sort Trees</CredenzaTitle>
          <CredenzaDescription>
            Customize how trees are displayed on the map
          </CredenzaDescription>
        </CredenzaHeader>

        <CredenzaBody>
          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tree Status</label>
            <Select
              value={currentStatus ?? undefined}
              onValueChange={(value: $Enums.TreeStatus) => {
                setIsOpen(false);
                updateSearchParams((prevParams) => {
                  return {
                    ...prevParams,
                    status: value,
                  };
                });
              }}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLANTED">All statuses</SelectItem>
                <SelectItem value="VERIFYING">Needs Verification</SelectItem>
                <SelectItem value="MATURED">Already Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Options */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <Select
              value={currentSort}
              disabled={isLoading}
              onValueChange={(value: SortBy) => {
                setIsOpen(false);
                updateSearchParams((prevParams) => {
                  return {
                    ...prevParams,
                    sortBy: value,
                  };
                });
              }}
            >
              <SelectTrigger>
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
          </div>

          {/* Location Controls */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Location</label>

            {hasLocation ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-md">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700 dark:text-green-400">
                      Location enabled
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearLocation}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Trees are sorted by distance and map is centered on your
                  location
                </p>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={handleUseCurrentLocation}
                disabled={isLoading}
                className="w-full bg-transparent"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Use My Location
              </Button>
            )}
          </div>

          {/* Active Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Active Filters</label>
              <div className="flex flex-wrap gap-2">
                {currentStatus && currentStatus !== "PLANTED" && (
                  <Badge variant="secondary">Status: {currentStatus}</Badge>
                )}
                {currentSort !== "newest" && (
                  <Badge variant="secondary">Sort: {currentSort}</Badge>
                )}
                {hasLocation && (
                  <Badge variant="secondary">Location enabled</Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="w-full"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="outline" className="flex-1">
              Close
            </Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
