/*
  Warnings:

  - You are about to alter the column `fullname` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - You are about to alter the column `bio` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - Made the column `content` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "content" SET NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "fullnameIsPublic" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "fullname" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "bio" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailIsPublic" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "username" SET DATA TYPE VARCHAR(50);

ALTER TABLE "Post" ADD COLUMN "title" VARCHAR(100) NOT NULL;
