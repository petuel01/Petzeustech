
-- PETZEUSTECH NETWORKS - PRODUCTION SCHEMA v6.1
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `role` enum('ADMIN','USER') DEFAULT 'USER',
  `status` enum('active','blocked') DEFAULT 'active',
  `is_trial_used` tinyint(1) DEFAULT 0,
  `has_downloaded` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `plans` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `days` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `network` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `plan_id` varchar(50) NOT NULL,
  `expiry_date` datetime NOT NULL,
  `status` enum('ACTIVE','EXPIRED','PENDING') DEFAULT 'PENDING',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `plan_id` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transaction_id` varchar(100) NOT NULL UNIQUE,
  `status` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `plan_id` varchar(50) NOT NULL,
  `upload_date` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Unified Plan Seeding with File Creation Mastery
INSERT INTO `plans` (`id`, `name`, `days`, `price`, `network`) VALUES
('trial', '24H Trial', 1, 0.00, 'ORANGE'),
('basic', 'Basic Tier', 3, 500.00, 'ORANGE'),
('standard', 'Standard Tier', 7, 1000.00, 'ORANGE'),
('pro', 'Pro Elite', 15, 1500.00, 'ORANGE'),
('mtn_lite', 'MTN Lite', 15, 500.00, 'MTN'),
('mtn_monthly', 'MTN Monthly', 30, 1000.00, 'MTN'),
('master', 'File Creation Mastery', 9999, 15000.00, 'MTN');

SET FOREIGN_KEY_CHECKS = 1;
