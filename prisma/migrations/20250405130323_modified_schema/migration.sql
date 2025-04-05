/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Orders_email_key" ON "Orders"("email");
