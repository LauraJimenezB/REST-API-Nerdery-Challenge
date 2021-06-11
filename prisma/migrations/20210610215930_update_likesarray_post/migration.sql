/*
  Warnings:

  - You are about to drop the column `likeState` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the column `likeState` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comments" DROP COLUMN "likeState";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "likeState",
ADD COLUMN     "dislikedBy" INTEGER[],
ADD COLUMN     "likedBy" INTEGER[],
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- DropEnum
DROP TYPE "LikeState";
