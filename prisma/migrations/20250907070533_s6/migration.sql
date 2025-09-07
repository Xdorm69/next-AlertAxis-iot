/*
  Warnings:

  - A unique constraint covering the columns `[targetRfidId]` on the table `PendingRfidRequests` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."PendingRfidRequests" ADD COLUMN     "targetRfidId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PendingRfidRequests_targetRfidId_key" ON "public"."PendingRfidRequests"("targetRfidId");

-- AddForeignKey
ALTER TABLE "public"."PendingRfidRequests" ADD CONSTRAINT "PendingRfidRequests_targetRfidId_fkey" FOREIGN KEY ("targetRfidId") REFERENCES "public"."RFID"("id") ON DELETE CASCADE ON UPDATE CASCADE;
