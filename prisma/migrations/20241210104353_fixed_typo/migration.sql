/*
  Warnings:

  - You are about to drop the column `idAdmin` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "idAdmin",
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
