"use client";

import { useQueryStates } from "nuqs";
import { useTransition } from "react";

import {
  searchParamsParsers,
  searchParamsUrlKeys,
} from "@/app/app/(geo-needed)/trees/searchParams";

export function useMapSearchParams() {
  const [isLoading, startTransition] = useTransition();

  const [searchParams, updateSearchParams] = useQueryStates(
    searchParamsParsers,
    {
      shallow: false,
      urlKeys: searchParamsUrlKeys,
      startTransition,
    }
  );

  return { searchParams, updateSearchParams, isLoading };
}
