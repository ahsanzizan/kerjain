/*
  Warnings:

  - Added the required column `expiry_date` to the `AccountVerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccountVerificationToken" ADD COLUMN     "expiry_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sent" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
