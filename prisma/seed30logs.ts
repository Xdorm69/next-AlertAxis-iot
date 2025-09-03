import { prisma } from "@/lib/db";
import { AccessResults } from "@prisma/client";

async function main() {
  const userId = "cmf0n4a3c0001g8d81rwf9yv5";

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error(`User with id ${userId} not found`);

  let rfid = await prisma.rFID.findFirst({ where: { userId } });
  if (!rfid) {
    rfid = await prisma.rFID.create({
      data: { tagId: `TAG-${userId}`, userId },
    });
  }

  const [device1, device2] = await Promise.all([
    prisma.device.upsert({
      where: { serialNumber: "DEV-001" },
      update: {},
      create: {
        name: "Main Entrance Scanner",
        serialNumber: "DEV-001",
        registeredById: user.id,
      },
    }),
    prisma.device.upsert({
      where: { serialNumber: "DEV-002" },
      update: {},
      create: {
        name: "Parking Lot Scanner",
        serialNumber: "DEV-002",
        registeredById: user.id,
      },
    }),
  ]);

  const now = new Date();
  const logs: any[] = [];

  // Generate logs for the last 7 days with variable counts
  for (let day = 0; day < 7; day++) {
    const logCount = Math.floor(Math.random() * 5) + 2; // 2–6 logs per day
    for (let i = 0; i < logCount; i++) {
      const randomHour = Math.floor(Math.random() * 24);
      const randomMinute = Math.floor(Math.random() * 60);

      const ts = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - day,
        randomHour,
        randomMinute
      );

      logs.push({
        userId: user.id,
        rfidId: rfid.id,
        deviceId: Math.random() > 0.5 ? device1.id : device2.id,
        status:
          Math.random() > 0.3 ? AccessResults.GRANTED : AccessResults.DENIED, // ~70% granted
        timestamp: ts,
      });
    }
  }

  await prisma.accessLog.createMany({ data: logs });
  console.log(`✅ Seeded ${logs.length} access logs for user: ${userId}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
