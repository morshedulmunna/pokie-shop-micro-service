/*
  Warnings:

  - Added the required column `number` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "History" ADD COLUMN     "number" TEXT NOT NULL;
