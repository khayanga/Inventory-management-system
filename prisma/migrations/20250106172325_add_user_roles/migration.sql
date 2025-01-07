/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "role" AS ENUM ('Admin', 'Client');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'Client';

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
