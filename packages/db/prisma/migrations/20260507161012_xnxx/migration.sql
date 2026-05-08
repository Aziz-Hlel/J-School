-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "annoucementId" UUID,
ADD COLUMN     "blurHash" VARCHAR(255),
ADD COLUMN     "order" INTEGER;

-- CreateTable
CREATE TABLE "annoucements" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "schoolId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "annoucements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "annoucements" ADD CONSTRAINT "annoucements_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_annoucementId_fkey" FOREIGN KEY ("annoucementId") REFERENCES "annoucements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
