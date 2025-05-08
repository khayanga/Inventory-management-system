/*
  Warnings:

  - The `conditionAtCheckin` column on the `Checkout` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `conditionAtCheckout` on the `Checkout` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'DUTY_OFFICER');

-- DropForeignKey
ALTER TABLE "Checkout" DROP CONSTRAINT "Checkout_officerId_fkey";

-- AlterTable
ALTER TABLE "Checkout" DROP COLUMN "conditionAtCheckout",
ADD COLUMN     "conditionAtCheckout" "WeaponCondition" NOT NULL,
DROP COLUMN "conditionAtCheckin",
ADD COLUMN     "conditionAtCheckin" "WeaponCondition";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'DUTY_OFFICER';

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Officer" (
    "id" TEXT NOT NULL,
    "militaryId" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "rank" "MilitaryRank" NOT NULL,
    "unit" VARCHAR(100) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Officer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Officer_militaryId_key" ON "Officer"("militaryId");

-- CreateIndex
CREATE INDEX "Officer_militaryId_idx" ON "Officer"("militaryId");

-- CreateIndex
CREATE INDEX "Officer_status_idx" ON "Officer"("status");

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "Officer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
