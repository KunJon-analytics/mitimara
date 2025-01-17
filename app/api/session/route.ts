import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { authResultSchema, defaultSession } from "@/lib/validations/session";
import platformAPIClient from "@/lib/pi/platform-api-client";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const accessToken = searchParams.get("token");
  // accessToken is "hello" for /api/search?token=hello

  if (!accessToken) {
    console.error("[GET_SESSION]", "Invalid authentication params");
    return Response.json(defaultSession);
  }

  try {
    // Verify the user's access token with the /me endpoint:
    await platformAPIClient.get(`/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (err) {
    console.error("[GET_SESSION]", err);
    return Response.json(defaultSession);
  }

  try {
    const user = await prisma.user.findFirst({
      where: { accessToken },
      select: { username: true, id: true },
    });

    if (!user) {
      return Response.json(defaultSession);
    }

    return Response.json({
      username: user.username,
      isLoggedIn: true,
      id: user.id,
    });
  } catch (error) {
    console.error("GET_SESSION", error);
    return Response.json(defaultSession);
  }
}

// login
export async function POST(request: NextRequest) {
  const authResult = (await request.json()) as unknown;

  const parsedParam = authResultSchema.safeParse(authResult);

  if (!parsedParam.success) {
    console.error("[LOGIN_API]", "Invalid authentication params");
    return new NextResponse("Invalid authentication params", { status: 400 });
  }

  const auth = parsedParam.data;

  try {
    // Verify the user's access token with the /me endpoint:
    await platformAPIClient.get(`/me`, {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    });
  } catch (err) {
    console.error("[LOGIN_API]", err);
    return new NextResponse("Invalid access token", { status: 400 });
  }

  try {
    // create or update user then send user created event if created
    const existingUser = await prisma.user.findFirst({
      where: { uid: auth.user.uid },
    });
    if (existingUser) {
      // update accessToken and return session
      const updatedUser = await prisma.user.update({
        where: { uid: auth.user.uid },
        data: { accessToken: auth.accessToken, username: auth.user.username },
        select: { id: true, username: true },
      });

      // revalidate path or tag
      revalidatePath("/");

      return Response.json({
        username: updatedUser.username,
        isLoggedIn: true,
        id: updatedUser.id,
      });
    }

    // create user
    const newUser = await prisma.user.create({
      data: {
        accessToken: auth.accessToken,
        uid: auth.user.uid,
        username: auth.user.username,
        referrer: auth.referral,
      },
      select: { id: true, username: true },
    });

    // user created event should update referrer count and send tg message
    await inngest.send({
      name: "auth/user.created",
      data: {
        userId: newUser.id,
      },
    });

    // revalidate path or tag
    revalidatePath("/");

    return Response.json({
      username: newUser.username,
      isLoggedIn: true,
      id: newUser.id,
    });
  } catch (error) {
    console.error("[LOGIN_API]", error);
    return new NextResponse("Server Error", { status: 400 });
  }
}
