/*
  Warnings:

  - The values [Admin,Client,Employee] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `expiresAt` on the `Otp` table. All the data in the column will be lost.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to drop the `BillingDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Equipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EquipmentLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Supplier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Supply` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrderProducts` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[militaryId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `militaryId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rank` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MilitaryRank" AS ENUM ('Private', 'Corporal', 'Sergeant', 'Lieutenant', 'Captain', 'Major', 'Colonel', 'General');

-- CreateEnum
CREATE TYPE "WeaponStatus" AS ENUM ('AVAILABLE', 'CHECKED_OUT', 'MAINTENANCE', 'DECOMMISSIONED');

-- CreateEnum
CREATE TYPE "CheckoutStatus" AS ENUM ('ACTIVE', 'RETURNED', 'OVERDUE', 'LOST');

-- CreateEnum
CREATE TYPE "WeaponCondition" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'DUTY_OFFICER', 'OFFICER');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'DUTY_OFFICER';
COMMIT;

-- DropForeignKey
ALTER TABLE "BillingDetails" DROP CONSTRAINT "BillingDetails_userId_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_userId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_userId_fkey";

-- DropForeignKey
ALTER TABLE "Equipment" DROP CONSTRAINT "Equipment_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentLog" DROP CONSTRAINT "EquipmentLog_clientId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentLog" DROP CONSTRAINT "EquipmentLog_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentLog" DROP CONSTRAINT "EquipmentLog_equipmentId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentLog" DROP CONSTRAINT "EquipmentLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Supply" DROP CONSTRAINT "Supply_productId_fkey";

-- DropForeignKey
ALTER TABLE "Supply" DROP CONSTRAINT "Supply_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "Supply" DROP CONSTRAINT "Supply_userId_fkey";

-- DropForeignKey
ALTER TABLE "_OrderProducts" DROP CONSTRAINT "_OrderProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderProducts" DROP CONSTRAINT "_OrderProducts_B_fkey";

-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "expiresAt";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "militaryId" VARCHAR(20) NOT NULL,
ADD COLUMN     "rank" "MilitaryRank" NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "password" SET DATA TYPE TEXT,
ALTER COLUMN "role" SET DEFAULT 'DUTY_OFFICER';

-- DropTable
DROP TABLE "BillingDetails";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "Employee";

-- DropTable
DROP TABLE "Equipment";

-- DropTable
DROP TABLE "EquipmentLog";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "Supplier";

-- DropTable
DROP TABLE "Supply";

-- DropTable
DROP TABLE "_OrderProducts";

-- DropEnum
DROP TYPE "EmployeeRole";

-- DropEnum
DROP TYPE "EquipmentStatus";

-- DropEnum
DROP TYPE "OrderStatus";

-- CreateTable
CREATE TABLE "Weapon" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "model" VARCHAR(50) NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "location" VARCHAR(100),
    "status" "WeaponStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "condition" "WeaponCondition" NOT NULL DEFAULT 'EXCELLENT',
    "dateAcquired" TIMESTAMP(3),
    "lastInspectionDate" TIMESTAMP(3),
    "nextInspectionDate" TIMESTAMP(3),

    CONSTRAINT "Weapon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checkout" (
    "id" TEXT NOT NULL,
    "weaponId" TEXT NOT NULL,
    "officerId" TEXT NOT NULL,
    "dutyOfficerId" TEXT NOT NULL,
    "checkoutTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedReturnTime" TIMESTAMP(3),
    "checkinTime" TIMESTAMP(3),
    "purpose" TEXT NOT NULL,
    "status" "CheckoutStatus" NOT NULL DEFAULT 'ACTIVE',
    "conditionAtCheckout" TEXT NOT NULL,
    "conditionAtCheckin" TEXT,
    "notes" TEXT,

    CONSTRAINT "Checkout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Weapon_serialNumber_key" ON "Weapon"("serialNumber");

-- CreateIndex
CREATE INDEX "Weapon_serialNumber_idx" ON "Weapon"("serialNumber");

-- CreateIndex
CREATE INDEX "Weapon_status_idx" ON "Weapon"("status");

-- CreateIndex
CREATE INDEX "Checkout_checkoutTime_idx" ON "Checkout"("checkoutTime");

-- CreateIndex
CREATE INDEX "Checkout_status_idx" ON "Checkout"("status");

-- CreateIndex
CREATE UNIQUE INDEX "User_militaryId_key" ON "User"("militaryId");

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "Weapon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_dutyOfficerId_fkey" FOREIGN KEY ("dutyOfficerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
