-- CreateTable
CREATE TABLE `application_parameters` (
    `id` VARCHAR(191) NOT NULL,
    `key` ENUM('CLAUDE_API_KEY', 'MISTRAL_API_KEY', 'GEMINI_API_KEY', 'AI_MODEL') NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT 'general',
    `isSystem` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `application_parameters_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
