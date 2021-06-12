-- AlterTable
ALTER TABLE "User" ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "tokenConfirm" TEXT;
