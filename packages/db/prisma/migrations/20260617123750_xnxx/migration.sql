/*
  Warnings:

  - The values [PUBLIC_HOLIYDAY,PRIVATE_HOLIDAY] on the enum `CalendarSessionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CalendarSessionType_new" AS ENUM ('PUBLIC_HOLIDAY', 'SCHOOL_HOLIDAY', 'TRIP', 'EVENT', 'OTHER');
ALTER TABLE "calendars" ALTER COLUMN "type" TYPE "CalendarSessionType_new" USING ("type"::text::"CalendarSessionType_new");
ALTER TYPE "CalendarSessionType" RENAME TO "CalendarSessionType_old";
ALTER TYPE "CalendarSessionType_new" RENAME TO "CalendarSessionType";
DROP TYPE "public"."CalendarSessionType_old";
COMMIT;
