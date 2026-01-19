
-- PETZEUSTECH NETWORKS DATABASE SCHEMA
-- DATABASE NAME PLACEHOLDER: petzeustech_db

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `google_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) DEFAULT NULL, -- Only for admin
  `profile_pic` longtext DEFAULT NULL,
  `is_trial_used` tinyint(1) DEFAULT 0,
  `role` enum('USER', 'ADMIN') DEFAULT 'USER',
  `status` enum('active', 'blocked') DEFAULT 'active',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `plans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `days` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `is_trial` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `plans` (name, days, price, is_trial) VALUES 
('Trial', 2, 0.00, 1),
('Basic', 3, 500.00, 0),
('Standard', 7, 1000.00, 0),
('Pro', 15, 1500.00, 0),
('Elite', 30, 3000.00, 0);

CREATE TABLE `subscriptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `start_date` datetime NOT NULL,
  `expiry_date` datetime NOT NULL,
  `status` enum('ACTIVE', 'EXPIRED', 'TRIAL') DEFAULT 'ACTIVE',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transaction_id` varchar(100) NOT NULL UNIQUE,
  `status` enum('pending', 'approved', 'rejected') DEFAULT 'pending',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `plan_id` int(11) DEFAULT NULL, -- Relate to specific plan duration (including Trial)
  `cycle_start` timestamp DEFAULT CURRENT_TIMESTAMP,
  `cycle_end` datetime NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
