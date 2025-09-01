// prisma/seed.ts
import { prisma } from "@/lib/db"; // adjust path if needed
import { timeStamp } from "console";

async function main() {
  const userId = "cmf0n4a3c0001g8d81rwf9yv5";

  // Make sure user exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  // Ensure user has an RFID
  let rfid = await prisma.rFID.findFirst({ where: { userId } });
  if (!rfid) {
    rfid = await prisma.rFID.create({
      data: {
        tagId: `TAG-${userId}`,
        userId,
      },
    });
  }

  // Ensure some devices exist
  const [device1, device2] = await Promise.all([
    prisma.device.upsert({
      where: { serialNumber: "DEV-001" },
      update: {},
      create: { name: "Main Gate", serialNumber: "DEV-001", registeredById: user.id },
    }),
    prisma.device.upsert({
      where: { serialNumber: "DEV-002" },
      update: {},
      create: { name: "Back Door", serialNumber: "DEV-002", registeredById: user.id },
    }),
  ]);

  // Add 30 access logs for this user
  await prisma.accessLog.createMany({
    data: Array.from({ length: 30 }).map((_, i) => ({
      userId: user.id,
      rfidId: rfid.id,
      deviceId: i % 2 === 0 ? device1.id : device2.id,
      status: i % 3 === 0 ? "DENIED" : "GRANTED",
      timestamp: new Date(Date.now() - i * 60 * 1000), // stagger by 1 min
    })),
  });

  console.log("✅ Seeded 30 access logs for user:", userId);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
