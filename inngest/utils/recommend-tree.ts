import axios from "axios";
import { z } from "zod";

import { env } from "@/env.mjs";

type UnsplashSearchResponse = {
  results: {
    id: string;
    width: number;
    height: number;
    color: string;
    description: string;
    user: {
      id: string;
      name: string;
    };
    urls: {
      raw: string;
      full: string;
      regular: string;
      small: string;
      thumb: string;
    };
  }[];
};

type ClimateResponse = {
  request_values: {
    lat: number;
    lon: number;
  };
  return_values: {
    lat: number;
    lon: number;
    koppen_geiger_zone: string;
    zone_description: string;
  }[];
};

function climateZoneFallback(latitude: number) {
  if (latitude > 66.5) return "Arctic";
  if (latitude > 50) return "Boreal";
  if (latitude > 40) return "Temperate";
  if (latitude > 23.5) return "Subtropical";
  if (latitude > -23.5) return "Tropical";
  if (latitude > -40) return "Subtropical";
  if (latitude > -50) return "Temperate";
  return "Subpolar";
}

export async function getClimateZone(latitude: number, longitude: number) {
  const url = `http://climateapi.scottpinkelman.com/api/v1/location/${latitude}/${longitude}`;
  try {
    const response = await axios.get<ClimateResponse>(url);
    if (response.data.return_values.length > 0) {
      return response.data.return_values[0].zone_description;
    } else {
      return climateZoneFallback(latitude);
    }
  } catch (error) {
    return climateZoneFallback(latitude);
  }
}

export async function getRecommendedTreeImage(treeName: string) {
  // This would ideally call a climate zone API
  // For now, we'll use a simplified approach based on latitude
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    treeName + " tree"
  )}&client_id=${env.UNSPLASH_ACCESS_KEY}`;
  try {
    const imageSearchResponse = await axios.get<UnsplashSearchResponse>(url);

    const imageData = imageSearchResponse.data;

    if (imageData.results && imageData.results.length > 0) {
      return imageData.results[0].urls.regular;
    }
  } catch (error) {
    console.error("Error fetching tree image:", error);
    // Continue without image if there's an error
  }
}

export const recommendationSchema = z.object({
  commonName: z.string().describe("Name of the tree"),
  scientificName: z.string().describe("Scientific name"),
  description: z.string().describe("Brief description of the tree"),
  plantingSeason: z.string().describe("Best season to plant"),
  plantingDepth: z.string().describe("How deep to plant"),
  spacing: z.string().describe("How far from other trees/structures"),
  wateringNeeds: z.string().describe("Watering requirements"),
  sunlightNeeds: z.string().describe("Sunlight requirements"),
  soilRequirements: z.string().describe("Soil preferences"),
  growthRate: z.string().describe("How fast it grows"),
  matureHeight: z.string().describe("Height at maturity"),
  matureWidth: z.string().describe("Width at maturity"),
  recommendedClimate: z.string().describe("Ideal climate"),
  nativeToRegion: z.boolean().describe("true or false"),
  indigenousUses: z.string().describe("Traditional uses if any"),
  carbonSequestration: z.string().describe("Carbon capture ability"),
  wildlifeValue: z.string().describe("Benefits to wildlife"),
  otherBenefits: z.string().describe("Additional benefits"),
  recommendationReason: z
    .string()
    .describe("Why this tree is recommended for this location"),
});
