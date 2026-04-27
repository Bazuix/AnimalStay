-- AlterTable
ALTER TABLE `payment` MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `stay` ADD COLUMN `medsInfo` VARCHAR(191) NULL,
    ADD COLUMN `needsMeds` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `needsWalk` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `notes` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'worker',

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
