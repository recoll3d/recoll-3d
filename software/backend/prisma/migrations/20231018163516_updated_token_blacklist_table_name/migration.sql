/*
  Warnings:

  - You are about to drop the `token_blacklist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "token_blacklist" DROP CONSTRAINT "token_blacklist_user_id_fkey";

-- DropTable
DROP TABLE "token_blacklist";

-- CreateTable
CREATE TABLE "invalid_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "invalidated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invalid_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invalid_tokens_token_key" ON "invalid_tokens"("token");

-- AddForeignKey
ALTER TABLE "invalid_tokens" ADD CONSTRAINT "invalid_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
