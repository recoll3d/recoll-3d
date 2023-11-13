-- DropForeignKey
ALTER TABLE "recycling" DROP CONSTRAINT "recycling_collect_point_id_fkey";

-- AlterTable
ALTER TABLE "recycling" ALTER COLUMN "collect_point_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "recycling" ADD CONSTRAINT "recycling_collect_point_id_fkey" FOREIGN KEY ("collect_point_id") REFERENCES "collection_points"("id") ON DELETE SET NULL ON UPDATE CASCADE;
