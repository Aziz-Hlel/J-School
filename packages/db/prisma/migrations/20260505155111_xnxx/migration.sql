-- CreateTable
CREATE TABLE "studentExtraCurriculars" (
    "id" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "extraCurricularId" UUID NOT NULL,
    "schoolId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studentExtraCurriculars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "studentExtraCurriculars_studentId_extraCurricularId_key" ON "studentExtraCurriculars"("studentId", "extraCurricularId");

-- AddForeignKey
ALTER TABLE "studentExtraCurriculars" ADD CONSTRAINT "studentExtraCurriculars_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentExtraCurriculars" ADD CONSTRAINT "studentExtraCurriculars_extraCurricularId_fkey" FOREIGN KEY ("extraCurricularId") REFERENCES "extraCurriculars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentExtraCurriculars" ADD CONSTRAINT "studentExtraCurriculars_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;
