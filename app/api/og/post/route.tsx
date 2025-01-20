/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

import { TITLE } from "@/app/shared-metadata";
import { BasicLayout } from "../_components/basic-layout";
import { DEFAULT_URL, SIZE, calSemiBold } from "../utils";

export const runtime = "edge";

const IMAGE = "assets/og/blog/default.png";

export async function GET(req: Request) {
  const [calSemiBoldData] = await Promise.all([calSemiBold]);

  const { searchParams } = new URL(req.url);

  const title =
    (searchParams.has("title") && searchParams.get("title")) || TITLE;
  const description = searchParams.has("description")
    ? searchParams.get("description")
    : undefined;
  const image =
    (searchParams.has("image") && searchParams.get("image")) || IMAGE;

  return new ImageResponse(
    (
      <BasicLayout title={title} description={description}>
        {image ? (
          <img
            alt=""
            style={{ objectFit: "cover", height: 350 }} // h-80 = 320px
            tw="flex w-full"
            src={new URL(image, DEFAULT_URL).toString()}
          />
        ) : null}
      </BasicLayout>
    ),
    {
      ...SIZE,
      fonts: [
        {
          name: "Cal",
          data: calSemiBoldData,
          style: "normal",
          weight: 600,
        },
      ],
    }
  );
}
