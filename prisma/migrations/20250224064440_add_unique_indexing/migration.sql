/*
  Warnings:

  - A unique constraint covering the columns `[accountId,token]` on the table `AccountVerificationToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AccountVerificationToken_accountId_token_key" ON "AccountVerificationToken"("accountId", "token");
