-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "price" TEXT NOT NULL,
    "oldPrice" TEXT,
    "ctaLabel" TEXT NOT NULL DEFAULT 'написать в whatsapp',
    "ctaHref" TEXT NOT NULL,
    "validUntil" TEXT,
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Promotion_sortOrder_idx" ON "Promotion"("sortOrder");
