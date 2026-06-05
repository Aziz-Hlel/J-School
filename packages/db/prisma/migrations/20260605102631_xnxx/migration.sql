/*
  Warnings:

  - The values [SUSPENDED] on the enum `StudentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StudentStatus_new" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'EXPELLED');
ALTER TABLE "students" ALTER COLUMN "status" TYPE "StudentStatus_new" USING ("status"::text::"StudentStatus_new");
ALTER TYPE "StudentStatus" RENAME TO "StudentStatus_old";
ALTER TYPE "StudentStatus_new" RENAME TO "StudentStatus";
DROP TYPE "public"."StudentStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "annoucements" ADD COLUMN     "title" VARCHAR(100) NOT NULL DEFAULT 'Announcement';
