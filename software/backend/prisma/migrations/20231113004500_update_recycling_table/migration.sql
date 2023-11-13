/*
  Warnings:

  - Made the column `collect_point_id` on table `recycling` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "recycling" DROP CONSTRAINT "recycling_collect_point_id_fkey";

-- AlterTable
ALTER TABLE "recycling" ALTER COLUMN "collect_point_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "recycling" ADD CONSTRAINT "recycling_collect_point_id_fkey" FOREIGN KEY ("collect_point_id") REFERENCES "collection_points"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
