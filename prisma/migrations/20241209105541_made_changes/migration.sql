/*
  Warnings:

  - You are about to drop the column `category` on the `Products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Products" DROP COLUMN "category",
ALTER COLUMN "creatorID" DROP NOT NULL;
