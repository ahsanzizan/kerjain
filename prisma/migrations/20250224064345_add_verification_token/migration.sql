-- CreateTable
CREATE TABLE "AccountVerificationToken" (
    "token" TEXT NOT NULL,
    "accountId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountVerificationToken_token_key" ON "AccountVerificationToken"("token");

-- AddForeignKey
ALTER TABLE "AccountVerificationToken" ADD CONSTRAINT "AccountVerificationToken_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
