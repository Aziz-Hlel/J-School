/*
  Warnings:

  - Added the required column `week` to the `calendars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "calendars" ADD COLUMN     "week" SMALLINT NOT NULL;
