/*
  Warnings:

  - Added the required column `quantity` to the `orderItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orderItems" ADD COLUMN     "quantity" INTEGER NOT NULL;
