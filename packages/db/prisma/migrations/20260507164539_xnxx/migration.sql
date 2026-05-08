-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'HEART');

-- CreateTable
CREATE TABLE "reactions" (
    "id" UUID NOT NULL,
    "type" "ReactionType" NOT NULL DEFAULT 'LIKE',
    "userId" UUID NOT NULL,
    "annoucementId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reactions_userId_annoucementId_key" ON "reactions"("userId", "annoucementId");

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_annoucementId_fkey" FOREIGN KEY ("annoucementId") REFERENCES "annoucements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
