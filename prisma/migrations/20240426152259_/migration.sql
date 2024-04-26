-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateTable
CREATE TABLE "private"."BusinessRequest" (
    "id" TEXT NOT NULL,
    "producer" JSONB,
    "referrer" TEXT,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "user" JSONB NOT NULL,
    "vendor" JSONB,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "BusinessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."ImageRef" (
    "assetId" TEXT,
    "fileSize" INTEGER,
    "lastModified" TIMESTAMP(3),
    "originalFilename" TEXT,
    "producerId" TEXT,
    "productId" TEXT,
    "publicId" TEXT NOT NULL,
    "size" INTEGER[],
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "uploadedById" TEXT,
    "vendorId" TEXT,

    CONSTRAINT "ImageRef_pkey" PRIMARY KEY ("publicId")
);

-- CreateTable
CREATE TABLE "private"."Producer" (
    "contact" JSONB NOT NULL,
    "flags" JSONB NOT NULL,
    "id" TEXT NOT NULL,
    "license" JSONB NOT NULL,
    "location" JSONB NOT NULL,
    "mainImageRefId" TEXT,
    "name" TEXT NOT NULL,
    "signupStatus" JSONB NOT NULL,
    "slug" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Producer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."Product" (
    "batch" TEXT,
    "brand" TEXT,
    "concentrateType" TEXT,
    "cultivar" TEXT,
    "flags" JSONB NOT NULL,
    "id" TEXT NOT NULL,
    "isDraft" BOOLEAN NOT NULL,
    "mainImageRefId" TEXT,
    "name" TEXT NOT NULL,
    "normalizedTerps" JSONB,
    "potency" JSONB NOT NULL,
    "price" DOUBLE PRECISION,
    "pricePerGram" DOUBLE PRECISION,
    "producerId" TEXT,
    "productType" TEXT,
    "rating" JSONB,
    "slug" TEXT,
    "subspecies" TEXT,
    "terps" JSONB,
    "vendorId" TEXT,
    "weight" DOUBLE PRECISION,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "profileImageUrl" TEXT,
    "roles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."UserOnProducer" (
    "role" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "producerId" TEXT NOT NULL,

    CONSTRAINT "UserOnProducer_pkey" PRIMARY KEY ("userId","producerId")
);

-- CreateTable
CREATE TABLE "private"."UserOnVendor" (
    "role" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,

    CONSTRAINT "UserOnVendor_pkey" PRIMARY KEY ("userId","vendorId")
);

-- CreateTable
CREATE TABLE "private"."Vendor" (
    "contact" JSONB NOT NULL,
    "flags" JSONB NOT NULL,
    "id" TEXT NOT NULL,
    "latLng" postgis.geometry(Point, 4326),
    "license" JSONB NOT NULL,
    "location" JSONB NOT NULL,
    "mainImageRefId" TEXT,
    "name" TEXT NOT NULL,
    "operatingStatus" TEXT NOT NULL,
    "rating" JSONB,
    "schedule" JSONB NOT NULL,
    "signupStatus" JSONB NOT NULL,
    "slug" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Producer_slug_key" ON "private"."Producer"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "private"."Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_name_key" ON "private"."Vendor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_slug_key" ON "private"."Vendor"("slug");

-- CreateIndex
CREATE INDEX "blockgroup_idx" ON "private"."Vendor" USING GIST ("latLng");

-- AddForeignKey
ALTER TABLE "private"."BusinessRequest" ADD CONSTRAINT "BusinessRequest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "private"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."BusinessRequest" ADD CONSTRAINT "BusinessRequest_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "private"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."ImageRef" ADD CONSTRAINT "ImageRef_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "private"."Producer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."ImageRef" ADD CONSTRAINT "ImageRef_productId_fkey" FOREIGN KEY ("productId") REFERENCES "private"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."ImageRef" ADD CONSTRAINT "ImageRef_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "private"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."ImageRef" ADD CONSTRAINT "ImageRef_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "private"."Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."Producer" ADD CONSTRAINT "Producer_mainImageRefId_fkey" FOREIGN KEY ("mainImageRefId") REFERENCES "private"."ImageRef"("publicId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."Producer" ADD CONSTRAINT "Producer_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "private"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."Producer" ADD CONSTRAINT "Producer_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "private"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."Product" ADD CONSTRAINT "Product_mainImageRefId_fkey" FOREIGN KEY ("mainImageRefId") REFERENCES "private"."ImageRef"("publicId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."Product" ADD CONSTRAINT "Product_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "private"."Producer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."Product" ADD CONSTRAINT "Product_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "private"."Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."Product" ADD CONSTRAINT "Product_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "private"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."Product" ADD CONSTRAINT "Product_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "private"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."UserOnProducer" ADD CONSTRAINT "UserOnProducer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "private"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."UserOnProducer" ADD CONSTRAINT "UserOnProducer_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "private"."Producer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."UserOnVendor" ADD CONSTRAINT "UserOnVendor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "private"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."UserOnVendor" ADD CONSTRAINT "UserOnVendor_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "private"."Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."Vendor" ADD CONSTRAINT "Vendor_mainImageRefId_fkey" FOREIGN KEY ("mainImageRefId") REFERENCES "private"."ImageRef"("publicId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."Vendor" ADD CONSTRAINT "Vendor_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "private"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."Vendor" ADD CONSTRAINT "Vendor_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "private"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
