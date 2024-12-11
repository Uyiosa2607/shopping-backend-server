/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "idAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "img" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "Products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "price" INTEGER NOT NULL,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "creatorID" INTEGER NOT NULL,
    "category" TEXT[],

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);
