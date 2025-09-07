-- CreateEnum
CREATE TYPE "public"."RequestTypes" AS ENUM ('ACTIVATE', 'DEACTIVATE', 'PORT');

-- CreateTable
CREATE TABLE "public"."PendingRfidRequests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestType" "public"."RequestTypes" NOT NULL,
    "rfidId" TEXT NOT NULL,

    CONSTRAINT "PendingRfidRequests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingRfidRequests_rfidId_key" ON "public"."PendingRfidRequests"("rfidId");

-- AddForeignKey
ALTER TABLE "public"."PendingRfidRequests" ADD CONSTRAINT "PendingRfidRequests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PendingRfidRequests" ADD CONSTRAINT "PendingRfidRequests_rfidId_fkey" FOREIGN KEY ("rfidId") REFERENCES "public"."RFID"("id") ON DELETE CASCADE ON UPDATE CASCADE;
