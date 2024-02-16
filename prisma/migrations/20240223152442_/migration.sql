-- AlterTable
ALTER TABLE "ImageRef" ADD COLUMN     "producerId" TEXT;

-- AlterTable
ALTER TABLE "Producer" ADD COLUMN     "mainImageRefId" TEXT;

-- AddForeignKey
ALTER TABLE "ImageRef" ADD CONSTRAINT "ImageRef_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "Producer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producer" ADD CONSTRAINT "Producer_mainImageRefId_fkey" FOREIGN KEY ("mainImageRefId") REFERENCES "ImageRef"("publicId") ON DELETE SET NULL ON UPDATE CASCADE;
