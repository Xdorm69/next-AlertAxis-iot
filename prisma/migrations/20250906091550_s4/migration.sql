/*
  Warnings:

  - The `status` column on the `Device` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `name` on table `Device` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `Device` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."DeviceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE');

-- AlterTable
ALTER TABLE "public"."Device" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."DeviceStatus" NOT NULL DEFAULT 'ACTIVE';
