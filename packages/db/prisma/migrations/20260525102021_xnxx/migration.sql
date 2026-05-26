-- CreateEnum
CREATE TYPE "CalendarSessionType" AS ENUM ('PUBLIC_HOLIYDAY', 'PRIVATE_HOLIDAY', 'TRIP', 'EVENT', 'OTHER');

-- CreateTable
CREATE TABLE "calendars" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" "CalendarSessionType" NOT NULL,
    "startDate" DATE NOT NULL,
    "startTime" TIME,
    "endDate" DATE NOT NULL,
    "endTime" TIME,
    "schoolId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendars_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "calendars" ADD CONSTRAINT "calendars_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
