/*
  Warnings:

  - You are about to drop the column `img` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "img" TEXT;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "img";
