-- AlterTable
ALTER TABLE "User" ALTER COLUMN "confirmedAt" DROP NOT NULL,
ALTER COLUMN "tokenConfirm" DROP NOT NULL;
