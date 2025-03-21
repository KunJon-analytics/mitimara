import { prisma } from "@/lib/prisma";

export async function getUserForAdmin(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        points: true,
        policingPoints: true,
        isActive: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user for admin:", error);
    return null;
  }
}
