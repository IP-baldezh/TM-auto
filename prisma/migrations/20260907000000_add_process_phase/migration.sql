-- AlterTable: добавляем поле phase к ProcessStep
ALTER TABLE "ProcessStep" ADD COLUMN "phase" TEXT NOT NULL DEFAULT '';
