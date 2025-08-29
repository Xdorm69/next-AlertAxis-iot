-- CreateEnum
CREATE TYPE "public"."UserRoles" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "public"."AccessResults" AS ENUM ('GRANTED', 'DENIED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "public"."UserRoles" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RFID" (
    "id" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RFID_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AccessLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rfidId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."AccessResults" NOT NULL,

    CONSTRAINT "AccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "public"."User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RFID_tagId_key" ON "public"."RFID"("tagId");

-- AddForeignKey
ALTER TABLE "public"."RFID" ADD CONSTRAINT "RFID_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccessLog" ADD CONSTRAINT "AccessLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccessLog" ADD CONSTRAINT "AccessLog_rfidId_fkey" FOREIGN KEY ("rfidId") REFERENCES "public"."RFID"("id") ON DELETE CASCADE ON UPDATE CASCADE;
