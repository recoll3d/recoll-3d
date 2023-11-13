-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_level_id_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "level_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;
