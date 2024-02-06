-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateTable
CREATE TABLE "Product" (
    "brand" TEXT,
    "concentrateType" TEXT,
    "cultivar" TEXT,
    "flags" JSONB NOT NULL,
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "potency" JSONB NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "pricePerGram" DOUBLE PRECISION NOT NULL,
    "productType" TEXT NOT NULL,
    "rating" JSONB,
    "subspecies" TEXT NOT NULL,
    "terps" JSONB,
    "vendorName" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "flags" JSONB NOT NULL,
    "id" SERIAL NOT NULL,
    "latLng" geometry(Point, 4326),
    "location" JSONB,
    "name" TEXT NOT NULL,
    "rating" JSONB,
    "schedule" JSONB NOT NULL,
    "url" TEXT,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_name_key" ON "Vendor"("name");

-- CreateIndex
CREATE INDEX "blockgroup_idx" ON "Vendor" USING GIST ("latLng");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_vendorName_fkey" FOREIGN KEY ("vendorName") REFERENCES "Vendor"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
