/*
  Warnings:

  - The primary key for the `DefaultUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `DefaultUser` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Member` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `id` on the `Member` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `projectId` on the `Member` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Member_projectId_idx";

-- AlterTable
ALTER TABLE "DefaultUser" DROP CONSTRAINT "DefaultUser_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "password" SET DEFAULT 'member@f2-fin',
ADD CONSTRAINT "DefaultUser_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "projectId" TEXT;

-- AlterTable
ALTER TABLE "Member" DROP CONSTRAINT "Member_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
DROP COLUMN "projectId",
ADD COLUMN     "projectId" INTEGER NOT NULL,
ADD CONSTRAINT "Member_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Project" DROP CONSTRAINT "Project_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Project_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Sprint" ADD COLUMN     "projectId" TEXT;
