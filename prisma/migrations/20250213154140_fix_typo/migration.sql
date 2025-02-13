/*
  Warnings:

  - The values [CANCELLED] on the enum `GigStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GigStatus_new" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELED');
ALTER TABLE "Gig" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Gig" ALTER COLUMN "status" TYPE "GigStatus_new" USING ("status"::text::"GigStatus_new");
ALTER TYPE "GigStatus" RENAME TO "GigStatus_old";
ALTER TYPE "GigStatus_new" RENAME TO "GigStatus";
DROP TYPE "GigStatus_old";
ALTER TABLE "Gig" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;
