/*
  Warnings:

  - Added the required column `confirmedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenConfirm` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "confirmedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tokenConfirm" TEXT NOT NULL;
