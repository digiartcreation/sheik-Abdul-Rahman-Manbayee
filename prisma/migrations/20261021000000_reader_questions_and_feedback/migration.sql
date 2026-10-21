-- AlterTable
ALTER TABLE `Question` ADD COLUMN `askerEmail` VARCHAR(190) NULL,
    ADD COLUMN `askerName` VARCHAR(120) NULL,
    ADD COLUMN `topic` VARCHAR(120) NULL,
    MODIFY `answer` LONGTEXT NULL;

-- CreateTable
CREATE TABLE `Feedback` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(190) NOT NULL,
    `type` VARCHAR(40) NOT NULL,
    `content` TEXT NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Feedback_status_createdAt_idx`(`status`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- The three comments that used to be hard-coded in /ungal-paguthi, so the page
-- does not go blank when it starts reading this table. Delete them from the
-- admin panel if they are not wanted.
INSERT INTO `Feedback` (`name`, `email`, `type`, `content`, `status`, `createdAt`, `updatedAt`) VALUES
    ('அஹ்மது', '', 'கருத்து', 'மிகவும் பயனுள்ள இணையதளம். இஸ்லாமிய கல்வியை தமிழில் எளிமையாக புரிந்துகொள்ள உதவுகிறது. ஜஸாக்கல்லாஹு கைரன்!', 'ACTIVE', '2024-10-15 00:00:00.000', '2024-10-15 00:00:00.000'),
    ('ஃபாத்திமா', '', 'கருத்து', 'ஹதீஸ் எப்படி புரிவது என்ற தொடர் மிகவும் அருமை. இன்னும் அதிக கட்டுரைகள் வெளியிடுங்கள்.', 'ACTIVE', '2024-09-22 00:00:00.000', '2024-09-22 00:00:00.000'),
    ('இப்ராஹீம்', '', 'கருத்து', 'மதங்கள் பிரிவு மிகவும் ஆழமாக எழுதப்பட்டுள்ளது. இது போன்ற ஒப்பீட்டு ஆய்வுகள் மேலும் தேவை.', 'ACTIVE', '2024-08-10 00:00:00.000', '2024-08-10 00:00:00.000');
