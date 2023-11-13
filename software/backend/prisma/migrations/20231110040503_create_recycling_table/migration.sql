-- CreateTable
CREATE TABLE "recycling" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "point_id" TEXT NOT NULL,
    "number_of_bottles" INTEGER NOT NULL,
    "total_bottles_score" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_at" TIMESTAMP(3),

    CONSTRAINT "recycling_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recycling" ADD CONSTRAINT "recycling_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recycling" ADD CONSTRAINT "recycling_point_id_fkey" FOREIGN KEY ("point_id") REFERENCES "collection_points"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
