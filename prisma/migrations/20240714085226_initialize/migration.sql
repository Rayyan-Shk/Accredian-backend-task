-- CreateTable
CREATE TABLE `Referral` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `referralName` VARCHAR(191) NOT NULL,
    `referralEmail` VARCHAR(191) NOT NULL,
    `referralDetails` VARCHAR(191) NOT NULL,
    `referrerName` VARCHAR(191) NULL,
    `referrerEmail` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
