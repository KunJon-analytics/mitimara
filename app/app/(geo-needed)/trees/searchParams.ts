import { $Enums } from "@prisma/client";
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsFloat,
  parseAsStringEnum,
  parseAsStringLiteral,
  type UrlKeys,
} from "nuqs/server";

const sortBy = ["distance", "newest", "oldest"] as const;
export type SortBy = (typeof sortBy)[number];

export const defaultRadius = 6000;

export const searchParamsParsers = {
  // Use human-readable variable names throughout your codebase
  latitude: parseAsFloat,
  longitude: parseAsFloat,
  status: parseAsStringEnum<$Enums.TreeStatus>(
    Object.values($Enums.TreeStatus)
  ),
  // Then pass it to the parser
  sortBy: parseAsStringLiteral(sortBy).withDefault("newest"),
  radius: parseAsInteger.withDefault(defaultRadius),
};

export const searchParamsUrlKeys: UrlKeys<typeof searchParamsParsers> = {
  // Remap them to read from shorter keys in the URL
  latitude: "lat",
  longitude: "lng",
  sortBy: "sort",
};

export const searchParamsCache = createSearchParamsCache(searchParamsParsers, {
  urlKeys: searchParamsUrlKeys,
});
