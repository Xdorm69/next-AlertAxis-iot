-- AlterEnum
ALTER TYPE "public"."RequestTypes" ADD VALUE 'CREATE';

-- AddForeignKey
ALTER TABLE "public"."PendingRfidRequests" ADD CONSTRAINT "PendingRfidRequests_approvedByAdmin_fkey" FOREIGN KEY ("approvedByAdmin") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
