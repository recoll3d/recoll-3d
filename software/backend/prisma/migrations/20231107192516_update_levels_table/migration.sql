-- AlterTable
ALTER TABLE "levels" ALTER COLUMN "unlocked" DROP NOT NULL,
ALTER COLUMN "unlocked" SET DEFAULT false;
