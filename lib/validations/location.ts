import type { Geo } from "@vercel/functions";

export const defaultLocation: Geo = {
  city: "New York",
  country: "US",
  flag: "🇺🇸",
  countryRegion: "NY",
  region: "iad1",
  latitude: "40.7128",
  longitude: "-74.0060",
  postalCode: "10001",
};

export const defaultUserLocation = {
  latitude: parseFloat(defaultLocation.latitude as string),
  longitude: parseFloat(defaultLocation.longitude as string),
};
