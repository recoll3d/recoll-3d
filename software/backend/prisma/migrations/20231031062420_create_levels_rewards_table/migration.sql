-- CreateTable
CREATE TABLE "level_rewards" (
    "id" TEXT NOT NULL,
    "level_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "unlocked_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "level_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "level_rewards_level_id_key" ON "level_rewards"("level_id");

-- AddForeignKey
ALTER TABLE "level_rewards" ADD CONSTRAINT "level_rewards_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
