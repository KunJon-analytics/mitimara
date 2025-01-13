import prisma from "../prisma";

export const getReferrer = async (username: string) => {
  return prisma.user.findFirst({
    where: { username },
    select: { username: true },
  });
};
