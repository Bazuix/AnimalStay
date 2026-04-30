-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 30, 2026 at 10:55 PM
-- Wersja serwera: 11.7.2-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `animalstay`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `owner`
--

CREATE TABLE `owner` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `owner`
--

INSERT INTO `owner` (`id`, `name`, `email`, `phone`) VALUES
(1, 'Jan Kowalski', 'jan@example.com', '123456789'),
(2, 'Anna Nowak', 'anna@example.com', '987654321'),
(3, 'Piotr Zielinski', 'piotr@example.com', '555666777'),
(4, 'Katarzyna Lewandowska', 'kasia@example.com', '444333222');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `payment`
--

CREATE TABLE `payment` (
  `id` int(11) NOT NULL,
  `amount` double NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'pending',
  `paidAt` datetime(3) DEFAULT NULL,
  `stayId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`id`, `amount`, `status`, `paidAt`, `stayId`) VALUES
(1, 150, 'paid', '2026-04-28 20:41:07.000', 1),
(2, 200, 'pending', NULL, 2),
(3, 350, 'paid', '2026-04-28 20:41:07.000', 3),
(4, 300, 'pending', NULL, 4),
(5, 400, 'paid', '2026-04-28 20:41:07.000', 5),
(6, 180, 'paid', '2026-04-28 20:41:07.000', 6),
(7, 120, 'pending', NULL, 7),
(8, 90, 'paid', '2026-04-28 20:41:07.000', 8),
(9, 160, 'paid', '2026-04-28 20:41:07.000', 9),
(10, 220, 'pending', NULL, 10);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `pet`
--

CREATE TABLE `pet` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `species` varchar(191) NOT NULL,
  `breed` varchar(191) DEFAULT NULL,
  `age` int(11) NOT NULL,
  `ownerId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pet`
--

INSERT INTO `pet` (`id`, `name`, `species`, `breed`, `age`, `ownerId`) VALUES
(1, 'Reksio', 'Dog', 'Labrador retriever', 3, 1),
(2, 'Burek', 'Dog', 'German shepherd', 5, 1),
(3, 'Mruczek', 'Cat', 'Persian', 2, 2),
(4, 'Filemon', 'Cat', 'Maine Coon', 4, 2),
(5, 'Azor', 'Dog', 'Beagle', 6, 3),
(6, 'Koko', 'Bird', 'Cockatiel', 1, 4),
(7, 'Max', 'Dog', 'Husky', 4, 1),
(8, 'Luna', 'Cat', 'Bengal', 3, 2),
(9, 'Rocky', 'Dog', 'Bulldog', 5, 3),
(10, 'Nemo', 'Fish', 'Clownfish', 1, 4);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `room`
--

CREATE TABLE `room` (
  `id` int(11) NOT NULL,
  `number` int(11) NOT NULL,
  `type` varchar(191) NOT NULL,
  `pricePerDay` double NOT NULL,
  `status` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`id`, `number`, `type`, `pricePerDay`, `status`) VALUES
(1, 101, 'Standard', 30, 'occupied'),
(2, 102, 'Standard', 30, 'occupied'),
(3, 103, 'Standard', 30, 'available'),
(4, 104, 'Deluxe', 50, 'available'),
(5, 105, 'Deluxe', 50, 'occupied'),
(6, 106, 'Suite', 80, 'occupied'),
(7, 107, 'Suite', 80, 'available'),
(8, 108, 'Kennel', 20, 'available'),
(9, 109, 'Kennel', 20, 'available'),
(10, 110, 'Aquarium', 15, 'available');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `service`
--

CREATE TABLE `service` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `price` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `service`
--

INSERT INTO `service` (`id`, `name`, `price`) VALUES
(1, 'Medication administration', 15),
(2, 'Daily walk', 10),
(3, 'Grooming', 30),
(4, 'Veterinary check', 50),
(5, 'Special diet', 20);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `stay`
--

CREATE TABLE `stay` (
  `id` int(11) NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `status` varchar(191) NOT NULL,
  `petId` int(11) NOT NULL,
  `roomId` int(11) NOT NULL,
  `medsInfo` varchar(191) DEFAULT NULL,
  `needsMeds` tinyint(1) NOT NULL DEFAULT 0,
  `needsWalk` tinyint(1) NOT NULL DEFAULT 1,
  `notes` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stay`
--

INSERT INTO `stay` (`id`, `startDate`, `endDate`, `status`, `petId`, `roomId`, `medsInfo`, `needsMeds`, `needsWalk`, `notes`) VALUES
(1, '2026-05-01 00:00:00.000', '2026-05-05 00:00:00.000', 'ACTIVE', 1, 1, NULL, 0, 1, 'Calm'),
(2, '2026-05-02 00:00:00.000', '2026-05-06 00:00:00.000', 'ACTIVE', 3, 2, NULL, 1, 0, 'Aggressive'),
(3, '2026-05-10 00:00:00.000', '2026-05-15 00:00:00.000', 'PLANNED', 2, 3, NULL, 0, 1, NULL),
(4, '2026-05-12 00:00:00.000', '2026-05-18 00:00:00.000', 'PLANNED', 4, 4, NULL, 0, 1, NULL),
(5, '2026-06-01 00:00:00.000', '2026-06-07 00:00:00.000', 'ACTIVE', 5, 5, NULL, 0, 1, NULL),
(6, '2026-06-05 00:00:00.000', '2026-06-10 00:00:00.000', 'ACTIVE', 1, 6, NULL, 0, 1, NULL),
(7, '2026-06-10 00:00:00.000', '2026-06-12 00:00:00.000', 'PLANNED', 3, 7, NULL, 0, 1, NULL),
(8, '2026-07-01 00:00:00.000', '2026-07-05 00:00:00.000', 'FINISHED', 2, 8, NULL, 0, 1, NULL),
(9, '2026-07-03 00:00:00.000', '2026-07-08 00:00:00.000', 'FINISHED', 4, 9, NULL, 0, 1, NULL),
(10, '2026-07-10 00:00:00.000', '2026-07-15 00:00:00.000', 'PLANNED', 5, 10, NULL, 0, 1, NULL);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `stayservice`
--

CREATE TABLE `stayservice` (
  `stayId` int(11) NOT NULL,
  `serviceId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stayservice`
--

INSERT INTO `stayservice` (`stayId`, `serviceId`) VALUES
(1, 1),
(6, 1),
(1, 2),
(5, 2),
(10, 2),
(4, 3),
(7, 3),
(2, 4),
(8, 4),
(3, 5),
(9, 5);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'worker'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `role`) VALUES
(3, 'worker@animalstay.com', '$2b$10$kvp05OzwxY1YZQ6ZAFIS/usNUHkIwE7HhmX3NCpNUCtvgrlDU9NYS', 'worker'),
(4, 'admin@animalstay.com', '$2b$10$mOSDbxoIGpIh9Oy3qUihyu3XyV8N6bWa8cyDNjR5BjSKtzjbV.8ya', 'admin');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('3e885f2e-fe17-4f3f-9de5-28a499543278', '8ecf7391adbd37f55a505cca2983d22cd162f101307329bff125ebd132814494', '2026-04-20 19:38:50.914', '20260420193850_init', NULL, NULL, '2026-04-20 19:38:50.715', 1),
('fb9a3edb-10f5-42de-adfb-2fa353b71d8a', 'c1bad22cc54c708862b2824c1887024ecb9bd3bfaff30afad8685f99221ebe41', '2026-04-27 00:01:48.248', '20260427000148_init', NULL, NULL, '2026-04-27 00:01:48.201', 1);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `owner`
--
ALTER TABLE `owner`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Owner_email_key` (`email`);

--
-- Indeksy dla tabeli `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Payment_stayId_key` (`stayId`);

--
-- Indeksy dla tabeli `pet`
--
ALTER TABLE `pet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Pet_ownerId_fkey` (`ownerId`);

--
-- Indeksy dla tabeli `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `stay`
--
ALTER TABLE `stay`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Stay_petId_fkey` (`petId`),
  ADD KEY `Stay_roomId_fkey` (`roomId`);

--
-- Indeksy dla tabeli `stayservice`
--
ALTER TABLE `stayservice`
  ADD PRIMARY KEY (`stayId`,`serviceId`),
  ADD KEY `StayService_serviceId_fkey` (`serviceId`);

--
-- Indeksy dla tabeli `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indeksy dla tabeli `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `owner`
--
ALTER TABLE `owner`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `pet`
--
ALTER TABLE `pet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `service`
--
ALTER TABLE `service`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `stay`
--
ALTER TABLE `stay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `Payment_stayId_fkey` FOREIGN KEY (`stayId`) REFERENCES `stay` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `pet`
--
ALTER TABLE `pet`
  ADD CONSTRAINT `Pet_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `owner` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `stay`
--
ALTER TABLE `stay`
  ADD CONSTRAINT `Stay_petId_fkey` FOREIGN KEY (`petId`) REFERENCES `pet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Stay_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `room` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `stayservice`
--
ALTER TABLE `stayservice`
  ADD CONSTRAINT `StayService_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `service` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `StayService_stayId_fkey` FOREIGN KEY (`stayId`) REFERENCES `stay` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
