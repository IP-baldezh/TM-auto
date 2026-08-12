-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "NavGroup" AS ENUM ('HEADER', 'FOOTER', 'LEGAL');

-- CreateEnum
CREATE TYPE "StepKind" AS ENUM ('RANGE', 'SINGLE', 'MULTI');

-- CreateEnum
CREATE TYPE "ReasonSize" AS ENUM ('LARGE', 'MEDIUM', 'SMALL');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'DONE', 'SPAM');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('CALCULATOR', 'FINAL_CTA', 'HEADER', 'SERVICE', 'CONTACTS', 'OTHER');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Администратор',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("tokenHash")
);

-- CreateTable
CREATE TABLE "SectionBlock" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "eyebrow" TEXT,
    "title" TEXT,
    "subtitle" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SectionBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavigationItem" (
    "id" TEXT NOT NULL,
    "group" "NavGroup" NOT NULL DEFAULT 'HEADER',
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "external" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NavigationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroSection" (
    "id" TEXT NOT NULL DEFAULT 'hero',
    "eyebrow" TEXT,
    "titleLead" TEXT NOT NULL,
    "titleAccent" TEXT NOT NULL,
    "titleTail" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "trustLine" TEXT,
    "primaryLabel" TEXT NOT NULL,
    "primaryHref" TEXT NOT NULL,
    "secondaryLabel" TEXT NOT NULL,
    "secondaryHref" TEXT NOT NULL,
    "layerSkyUrl" TEXT NOT NULL,
    "layerMidUrl" TEXT,
    "layerCarUrl" TEXT NOT NULL,
    "layerCarIsCutout" BOOLEAN NOT NULL DEFAULT false,
    "layerForegroundUrl" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrustItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TrustItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InspectionCategory" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "points" TEXT[],
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "InspectionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "outcomes" TEXT[],
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "ctaLabel" TEXT NOT NULL DEFAULT 'Оставить заявку',
    "ctaHref" TEXT NOT NULL DEFAULT '#calculator',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalculatorConfig" (
    "id" TEXT NOT NULL DEFAULT 'calculator',
    "eyebrow" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "baseFee" INTEGER NOT NULL,
    "minEstimate" INTEGER NOT NULL,
    "maxEstimate" INTEGER NOT NULL,
    "roundTo" INTEGER NOT NULL DEFAULT 1000,
    "spread" DOUBLE PRECISION NOT NULL DEFAULT 0.15,
    "reserveShare" DOUBLE PRECISION NOT NULL DEFAULT 0.05,
    "resultTitle" TEXT NOT NULL,
    "resultNote" TEXT,
    "disclaimer" TEXT NOT NULL,
    "ctaLabel" TEXT NOT NULL DEFAULT 'Получить варианты автомобилей',
    "successTitle" TEXT NOT NULL DEFAULT 'Заявка отправлена',
    "successText" TEXT NOT NULL DEFAULT 'Свяжемся с вами в рабочее время: 8:00–20:00, без выходных.',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalculatorConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalculatorStep" (
    "id" TEXT NOT NULL,
    "configId" TEXT NOT NULL DEFAULT 'calculator',
    "key" TEXT NOT NULL,
    "kind" "StepKind" NOT NULL,
    "title" TEXT NOT NULL,
    "hint" TEXT,
    "searchable" BOOLEAN NOT NULL DEFAULT false,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "rangeConfig" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CalculatorStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalculatorOption" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "hint" TEXT,
    "multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "addend" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CalculatorOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalculatorBudgetTier" (
    "id" TEXT NOT NULL,
    "upTo" INTEGER,
    "label" TEXT NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "addend" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CalculatorBudgetTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveredCar" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "mileage" INTEGER,
    "engine" TEXT,
    "transmission" TEXT,
    "drive" TEXT,
    "trim" TEXT,
    "location" TEXT,
    "searchDays" INTEGER,
    "price" INTEGER,
    "savings" INTEGER,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "imageAlt" TEXT,
    "gallery" TEXT[],
    "videoUrl" TEXT,
    "handedOverAt" TIMESTAMP(3),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveredCar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessStep" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "detail" TEXT,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProcessStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrustReason" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "size" "ReasonSize" NOT NULL DEFAULT 'MEDIUM',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TrustReason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" TEXT NOT NULL,
    "eyebrow" TEXT,
    "title" TEXT NOT NULL,
    "listingTitle" TEXT NOT NULL,
    "listingPrice" TEXT,
    "listingText" TEXT,
    "findings" TEXT[],
    "risks" TEXT[],
    "decisionTitle" TEXT NOT NULL,
    "decisionText" TEXT NOT NULL,
    "images" TEXT[],
    "imageAlt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "city" TEXT,
    "carTitle" TEXT,
    "text" TEXT NOT NULL,
    "rating" INTEGER,
    "avatarUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqItem" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FaqItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactChannel" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ContactChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'site',
    "brandName" TEXT NOT NULL DEFAULT 'Sunservice',
    "brandNote" TEXT NOT NULL DEFAULT 'Автотехцентр',
    "logoUrl" TEXT,
    "city" TEXT NOT NULL DEFAULT 'Дзержинск',
    "address" TEXT NOT NULL,
    "hours" TEXT NOT NULL,
    "email" TEXT,
    "whatsappUrl" TEXT,
    "telegramUrl" TEXT,
    "vkUrl" TEXT,
    "maxUrl" TEXT,
    "routeUrl" TEXT,
    "mapEmbedUrl" TEXT,
    "mapLat" DOUBLE PRECISION,
    "mapLng" DOUBLE PRECISION,
    "legalName" TEXT,
    "legalInn" TEXT,
    "leadWebhookUrl" TEXT,
    "leadWebhookSecret" TEXT,
    "privacyUrl" TEXT NOT NULL DEFAULT '/privacy',
    "consentUrl" TEXT NOT NULL DEFAULT '/consent',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoSettings" (
    "id" TEXT NOT NULL DEFAULT 'seo',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "h1" TEXT NOT NULL,
    "keywords" TEXT,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImageUrl" TEXT,
    "canonicalUrl" TEXT,
    "robots" TEXT NOT NULL DEFAULT 'index,follow',
    "headScripts" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "message" TEXT,
    "source" "LeadSource" NOT NULL DEFAULT 'OTHER',
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "calculatorData" JSONB,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "utmTerm" TEXT,
    "pageUrl" TEXT,
    "referrer" TEXT,
    "webhookStatus" TEXT,
    "adminNote" TEXT,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "SectionBlock_key_key" ON "SectionBlock"("key");

-- CreateIndex
CREATE INDEX "SectionBlock_sortOrder_idx" ON "SectionBlock"("sortOrder");

-- CreateIndex
CREATE INDEX "NavigationItem_group_sortOrder_idx" ON "NavigationItem"("group", "sortOrder");

-- CreateIndex
CREATE INDEX "TrustItem_sortOrder_idx" ON "TrustItem"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "InspectionCategory_code_key" ON "InspectionCategory"("code");

-- CreateIndex
CREATE INDEX "InspectionCategory_sortOrder_idx" ON "InspectionCategory"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "Service_sortOrder_idx" ON "Service"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "CalculatorStep_key_key" ON "CalculatorStep"("key");

-- CreateIndex
CREATE INDEX "CalculatorStep_sortOrder_idx" ON "CalculatorStep"("sortOrder");

-- CreateIndex
CREATE INDEX "CalculatorOption_sortOrder_idx" ON "CalculatorOption"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "CalculatorOption_stepId_value_key" ON "CalculatorOption"("stepId", "value");

-- CreateIndex
CREATE INDEX "CalculatorBudgetTier_sortOrder_idx" ON "CalculatorBudgetTier"("sortOrder");

-- CreateIndex
CREATE INDEX "DeliveredCar_published_sortOrder_idx" ON "DeliveredCar"("published", "sortOrder");

-- CreateIndex
CREATE INDEX "ProcessStep_sortOrder_idx" ON "ProcessStep"("sortOrder");

-- CreateIndex
CREATE INDEX "TrustReason_sortOrder_idx" ON "TrustReason"("sortOrder");

-- CreateIndex
CREATE INDEX "CaseStudy_sortOrder_idx" ON "CaseStudy"("sortOrder");

-- CreateIndex
CREATE INDEX "Testimonial_sortOrder_idx" ON "Testimonial"("sortOrder");

-- CreateIndex
CREATE INDEX "FaqItem_sortOrder_idx" ON "FaqItem"("sortOrder");

-- CreateIndex
CREATE INDEX "ContactChannel_sortOrder_idx" ON "ContactChannel"("sortOrder");

-- CreateIndex
CREATE INDEX "Lead_status_createdAt_idx" ON "Lead"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalculatorStep" ADD CONSTRAINT "CalculatorStep_configId_fkey" FOREIGN KEY ("configId") REFERENCES "CalculatorConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalculatorOption" ADD CONSTRAINT "CalculatorOption_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "CalculatorStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

