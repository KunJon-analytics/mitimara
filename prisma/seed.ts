import { PrismaClient } from "@prisma/client";
import { pots } from "../lib/pots/constants";

const prisma = new PrismaClient();

async function main() {
  const potsUpsertParams = pots.map((pot) => {
    return prisma.pot.upsert({
      create: { ...pot },
      where: { name: pot.name },
      update: {
        isOpen: pot.isOpen,
        isPublic: pot.isPublic,
        revenueFraction: pot.revenueFraction,
        walletAddress: pot.walletAddress,
      },
      select: {
        balance: true,
        name: true,
        revenueFraction: true,
        walletAddress: true,
      },
    });
  });

  const upsertedPots = await prisma.$transaction(potsUpsertParams);

  console.log({ upsertedPots });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
