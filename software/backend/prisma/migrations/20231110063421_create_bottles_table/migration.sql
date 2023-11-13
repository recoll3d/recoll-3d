/*
  Warnings:

  - You are about to drop the column `point_id` on the `recycling` table. All the data in the column will be lost.
  - Added the required column `collect_point_id` to the `recycling` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "recycling" DROP CONSTRAINT "recycling_point_id_fkey";

-- AlterTable
ALTER TABLE "recycling" DROP COLUMN "point_id",
ADD COLUMN     "collect_point_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "bottles" (
    "id" TEXT NOT NULL,
    "recycling_id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bottles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recycling" ADD CONSTRAINT "recycling_collect_point_id_fkey" FOREIGN KEY ("collect_point_id") REFERENCES "collection_points"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bottles" ADD CONSTRAINT "bottles_recycling_id_fkey" FOREIGN KEY ("recycling_id") REFERENCES "recycling"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
