-- CreateEnum
CREATE TYPE "SponsorTier" AS ENUM ('PREMIUM', 'PARTNER', 'SUPPORTER');

-- CreateEnum
CREATE TYPE "BusinessIntroRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "Sponsor" ADD COLUMN "logoUrl" TEXT,
ADD COLUMN "tier" "SponsorTier" NOT NULL DEFAULT 'PARTNER';

-- AlterTable
ALTER TABLE "BusinessListing" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "BusinessIntroRequest" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "targetListingId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "BusinessIntroRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BusinessIntroRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BusinessIntroRequest" ADD CONSTRAINT "BusinessIntroRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessIntroRequest" ADD CONSTRAINT "BusinessIntroRequest_targetListingId_fkey" FOREIGN KEY ("targetListingId") REFERENCES "BusinessListing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
