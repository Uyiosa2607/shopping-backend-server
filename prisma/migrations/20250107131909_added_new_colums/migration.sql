/*
  Warnings:

  - The `img` column on the `Products` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "inStock" BOOLEAN NOT NULL DEFAULT true,
DROP COLUMN "img",
ADD COLUMN     "img" TEXT[];
