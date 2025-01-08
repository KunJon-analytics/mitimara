import * as z from "zod";

import { $Enums } from "@prisma/client";
import { findNearbyTree, getUnverifiedTrees } from "../tree/services";

export function validateYouTubeUrl(url: string) {
  if (url != undefined || url != "") {
    var regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      // Do anything for being valid
      // if need to change the url to embed url then use below line
      // $("#ytplayerSide").attr(
      //   "src",
      //   "https://www.youtube.com/embed/" + match[2] + "?autoplay=0"
      // );
      return match[2];
    } else {
      // Do anything for not being valid
      return false;
    }
  }
  return false;
}

export const createTreeSchema = z.object({
  accessToken: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type CreateTreeSchema = z.infer<typeof createTreeSchema>;

export const editTreeInfoSchema = z.object({
  accessToken: z.string().min(1),
  treeId: z.string().min(1),
  additionalInfo: z.string().max(200).optional(),
});

export type EditTreeInfoSchema = z.infer<typeof editTreeInfoSchema>;

export const deleteEvidenceSchema = z.object({
  accessToken: z.string().min(1),
  evidenceId: z.string().min(1),
});

export type DeleteEvidenceSchema = z.infer<typeof deleteEvidenceSchema>;

export const treeEvidenceSchema = z
  .object({
    url: z.string().url(),
    accessToken: z.string().min(1),
    treeId: z.string().min(1),
    type: z.nativeEnum($Enums.MediaType),
  })
  .refine(
    (data) => {
      if (data.type === "VIDEO") {
        return validateYouTubeUrl(data.url);
      } else {
        return true;
      }
    },
    {
      message: "Invalid YouTube URL",
      path: ["url"], // path of error
    }
  );

export type TreeEvidenceSchema = z.infer<typeof treeEvidenceSchema>;

export const treeVerificationSchema = z
  .object({
    url: z.string().url(),
    accessToken: z.string().min(1),
    additionalInfo: z.string().optional(),
    isAuthentic: z.boolean(),
    treeId: z.string().min(1),
    type: z.nativeEnum($Enums.MediaType),
  })
  .refine(
    (data) => {
      if (data.type === "VIDEO") {
        return validateYouTubeUrl(data.url);
      } else {
        return true;
      }
    },
    {
      message: "Invalid YouTube URL",
      path: ["url"], // path of error
    }
  );

export type TreeVerificationSchema = z.infer<typeof treeVerificationSchema>;

export type NearbyTreeReturnType = Awaited<ReturnType<typeof findNearbyTree>>;

export type UnverifiedTrees = Awaited<ReturnType<typeof getUnverifiedTrees>>;
