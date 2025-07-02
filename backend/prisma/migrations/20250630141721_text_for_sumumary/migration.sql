/*
  Warnings:

  - You are about to alter the column `category` on the `documents` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `documents` MODIFY `category` VARCHAR(191) NOT NULL,
    MODIFY `summary` TEXT NULL;
