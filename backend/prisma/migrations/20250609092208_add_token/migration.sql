/*
  Warnings:

  - You are about to drop the column `acceptNewsletter` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `civility` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Token` DROP FOREIGN KEY `Token_owned_by_id_fkey`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `acceptNewsletter`,
    DROP COLUMN `birthDate`,
    DROP COLUMN `civility`,
    DROP COLUMN `phone`,
    ADD COLUMN `lastLoginAt` DATETIME(3) NULL;

-- DropTable
DROP TABLE `Token`;

-- CreateTable
CREATE TABLE `invitation_requests` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'USER',
    `status` ENUM('PENDING', 'ACCEPTED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
    `invited_by_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NULL,
    `token_id` VARCHAR(191) NULL,
    `invited_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `registered_at` DATETIME(3) NULL,

    UNIQUE INDEX `invitation_requests_email_key`(`email`),
    UNIQUE INDEX `invitation_requests_token_id_key`(`token_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tokens` (
    `id` VARCHAR(191) NOT NULL,
    `owned_by_id` VARCHAR(191) NULL,
    `token` TEXT NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `scopes` VARCHAR(191) NOT NULL,
    `device_name` VARCHAR(191) NULL,
    `device_ip` VARCHAR(191) NULL,
    `user_agent` VARCHAR(191) NULL,
    `browser_name` VARCHAR(191) NULL,
    `browser_version` VARCHAR(191) NULL,
    `os_name` VARCHAR(191) NULL,
    `os_version` VARCHAR(191) NULL,
    `device_type` VARCHAR(191) NULL,
    `device_vendor` VARCHAR(191) NULL,
    `device_model` VARCHAR(191) NULL,
    `location_city` VARCHAR(191) NULL,
    `location_country` VARCHAR(191) NULL,
    `location_lat` DOUBLE NULL,
    `location_lon` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `unvailable_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `invitation_requests` ADD CONSTRAINT `invitation_requests_token_id_fkey` FOREIGN KEY (`token_id`) REFERENCES `tokens`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitation_requests` ADD CONSTRAINT `invitation_requests_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitation_requests` ADD CONSTRAINT `invitation_requests_invited_by_id_fkey` FOREIGN KEY (`invited_by_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tokens` ADD CONSTRAINT `tokens_owned_by_id_fkey` FOREIGN KEY (`owned_by_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
