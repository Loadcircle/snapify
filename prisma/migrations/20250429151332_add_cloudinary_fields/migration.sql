/*
  Warnings:

  - Added the required column `publicId` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "height" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "publicId" TEXT NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL DEFAULT 0;
