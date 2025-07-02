-- CreateTable
CREATE TABLE `action_suggestions` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,
    `label` VARCHAR(191) NOT NULL,
    `document_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `completed_at` DATETIME(3) NULL,

    INDEX `action_suggestions_document_id_idx`(`document_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documents` (
    `id` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `original_name` VARCHAR(191) NOT NULL,
    `total_pages` INTEGER NULL,
    `category` ENUM('CONTRACT', 'REPORT', 'STANDARD', 'POLICY', 'MANUAL', 'AUDIT') NOT NULL DEFAULT 'MANUAL',
    `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'ERROR') NOT NULL DEFAULT 'PENDING',
    `size` INTEGER NULL,
    `summary` VARCHAR(191) NULL,
    `processing_time` INTEGER NULL,
    `media_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `documents_media_id_key`(`media_id`),
    INDEX `documents_user_id_created_at_idx`(`user_id`, `created_at`),
    INDEX `documents_status_idx`(`status`),
    INDEX `documents_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `key_points` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `document_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `key_points_document_id_idx`(`document_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `media` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `filename` VARCHAR(191) NULL,
    `original_name` VARCHAR(191) NULL,
    `mime_type` VARCHAR(191) NULL,
    `size` INTEGER NULL,
    `path` VARCHAR(191) NULL,
    `url` VARCHAR(191) NULL,
    `type` ENUM('DOCUMENT', 'IMAGE', 'PDF', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `uploaded_by_id` VARCHAR(191) NULL,

    INDEX `media_uploaded_by_id_created_at_idx`(`uploaded_by_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `action_suggestions` ADD CONSTRAINT `action_suggestions_document_id_fkey` FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_media_id_fkey` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `key_points` ADD CONSTRAINT `key_points_document_id_fkey` FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `media` ADD CONSTRAINT `media_uploaded_by_id_fkey` FOREIGN KEY (`uploaded_by_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
