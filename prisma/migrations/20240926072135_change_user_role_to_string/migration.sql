-- CreateEnum
CREATE TYPE "role" AS ENUM ('admin', 'manager', 'member');

-- AlterTable
ALTER TABLE "DefaultUser" ADD COLUMN     "password" TEXT,
ADD COLUMN     "role" "role" DEFAULT 'member',
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false;
