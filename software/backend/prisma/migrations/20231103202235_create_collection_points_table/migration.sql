-- CreateTable
CREATE TABLE "collection_points" (
    "id" TEXT NOT NULL,
    "mac_address" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "uf" CHAR(2) NOT NULL,

    CONSTRAINT "collection_points_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collection_points_mac_address_key" ON "collection_points"("mac_address");
