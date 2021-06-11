/*
  Warnings:

  - A unique constraint covering the columns `[userToken]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "userToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Token.userToken_unique" ON "Token"("userToken");
