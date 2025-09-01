import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create Admin
  const admin = await prisma.user.create({
    data: {
      clerkId: "clerk_admin_123",
      email: "admin@example.com",
      name: "Amitoj Singh",
      username: "admin",
      role: "ADMIN",
      adminSince: new Date(),
    },
  });

  // Create Users
  const alice = await prisma.user.create({
    data: {
      clerkId: "clerk_user_001",
      email: "alice@example.com",
      name: "Alice Johnson",
      username: "alicej",
      role: "USER",
    },
  });

  const bob = await prisma.user.create({
    data: {
      clerkId: "clerk_user_002",
      email: "bob@example.com",
      name: "Bob Williams",
      username: "bobby",
      role: "USER",
    },
  });

  // Create Devices (registered by admin)
  const device1 = await prisma.device.create({
    data: {
      serialNumber: "DEV-001",
      name: "Main Entrance Scanner",
      location: "Building A - Entrance",
      registeredById: admin.id,
    },
  });

  const device2 = await prisma.device.create({
    data: {
      serialNumber: "DEV-002",
      name: "Parking Lot Scanner",
      location: "Building A - Parking",
      registeredById: admin.id,
    },
  });

  // Create RFID cards for users
  const aliceRfid = await prisma.rFID.create({
    data: {
      tagId: "RFID-ALICE-123",
      userId: alice.id,
    },
  });

  const bobRfid = await prisma.rFID.create({
    data: {
      tagId: "RFID-BOB-456",
      userId: bob.id,
    },
  });

  // Create Access Logs
  await prisma.accessLog.createMany({
    data: [
      {
        userId: alice.id,
        rfidId: aliceRfid.id,
        deviceId: device1.id,
        status: "GRANTED",
      },
      {
        userId: bob.id,
        rfidId: bobRfid.id,
        deviceId: device1.id,
        status: "DENIED",
      },
      {
        userId: alice.id,
        rfidId: aliceRfid.id,
        deviceId: device2.id,
        status: "GRANTED",
      },
    ],
  });
}

main()
  .then(() => {
    console.log("Seeding finished.");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
