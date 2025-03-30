/*
  Warnings:

  - A unique constraint covering the columns `[reference]` on the table `Orders` will be added. If there are existing duplicate values, this will fail.
  - Made the column `reference` on table `Orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Orders" ALTER COLUMN "reference" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Orders_reference_key" ON "Orders"("reference");
