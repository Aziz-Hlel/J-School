-- CreateTable
CREATE TABLE "examSchedules" (
    "id" UUID NOT NULL,
    "examId" UUID NOT NULL,
    "assignementId" UUID NOT NULL,
    "schoolId" UUID NOT NULL,
    "semester" "Semester" NOT NULL,
    "day" DATE NOT NULL,
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "examSchedules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "examSchedules" ADD CONSTRAINT "examSchedules_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examSchedules" ADD CONSTRAINT "examSchedules_assignementId_fkey" FOREIGN KEY ("assignementId") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examSchedules" ADD CONSTRAINT "examSchedules_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
