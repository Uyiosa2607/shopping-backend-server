/*
  Warnings:

  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Products" ALTER COLUMN "creatorID" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "RefreshToken";
