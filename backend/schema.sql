
-- PETZEUSTECH NETWORKS - PRODUCTION SCHEMA v4.1
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Users Table
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

-- Plans Table
CREATE TABLE IF NOT EXISTS `plans` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `days` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `is_trial` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `plan_id` varchar(50) NOT NULL,
  `expiry_date` datetime NOT NULL,
  `status` enum('ACTIVE','EXPIRED','PENDING') DEFAULT 'PENDING',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Manual Payments Log
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

-- Configuration Files
CREATE TABLE IF NOT EXISTS `files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `plan_id` varchar(50) NOT NULL,
  `upload_date` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Initialize Default Plans (Updated prices and tiers)
INSERT INTO `plans` (`id`, `name`, `days`, `price`, `is_trial`) VALUES
('basic', 'Basic Plan', 3, 500.00, 0),
('standard', 'Standard Plan', 7, 1000.00, 0),
('pro', 'Pro Elite Plan', 15, 1500.00, 0),
('elite', 'Elite Access Plan', 30, 2500.00, 0);

SET FOREIGN_KEY_CHECKS = 1;
