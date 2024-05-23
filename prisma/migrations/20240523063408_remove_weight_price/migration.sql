/*
  Warnings:

  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerGram` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "private"."Product" DROP COLUMN "price",
DROP COLUMN "pricePerGram",
DROP COLUMN "weight";
