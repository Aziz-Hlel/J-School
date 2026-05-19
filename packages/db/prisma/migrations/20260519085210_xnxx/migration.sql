-- CreateTable
CREATE TABLE "aftercare" (
    "id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "supervisorId" UUID NOT NULL,
    "schoolId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aftercare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AftercareToStudent" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_AftercareToStudent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AftercareToStudent_B_index" ON "_AftercareToStudent"("B");

-- AddForeignKey
ALTER TABLE "aftercare" ADD CONSTRAINT "aftercare_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aftercare" ADD CONSTRAINT "aftercare_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AftercareToStudent" ADD CONSTRAINT "_AftercareToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "aftercare"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AftercareToStudent" ADD CONSTRAINT "_AftercareToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
