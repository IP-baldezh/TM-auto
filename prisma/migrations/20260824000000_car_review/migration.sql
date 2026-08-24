-- AlterTable: add optional review fields to DeliveredCar
ALTER TABLE "DeliveredCar" ADD COLUMN "reviewAuthor" TEXT;
ALTER TABLE "DeliveredCar" ADD COLUMN "reviewText"   TEXT;
