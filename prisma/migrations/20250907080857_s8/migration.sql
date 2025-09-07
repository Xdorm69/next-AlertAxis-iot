/*
  Warnings:

  - A unique constraint covering the columns `[tempTagId]` on the table `PendingRfidRequests` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."PendingRfidRequests" ADD COLUMN     "approvedByAdmin" TEXT,
ADD COLUMN     "tempTagId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PendingRfidRequests_tempTagId_key" ON "public"."PendingRfidRequests"("tempTagId");
