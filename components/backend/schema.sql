
-- PETZEUSTECH NETWORKS DATABASE SCHEMA (EXTENDED)

-- ... previous tables (users, plans, subscriptions, payments, files) ...

CREATE TABLE `tutorials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `step_order` int(11) NOT NULL DEFAULT 0,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `media_url` varchar(255) DEFAULT NULL,
  `media_type` enum('image', 'video') DEFAULT 'image',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `users` ADD COLUMN `has_seen_tutorial` tinyint(1) DEFAULT 0;

-- Educational Mentorship Offer Plan
INSERT INTO `plans` (name, days, price, is_trial) VALUES 
('Elite Mentorship', 9999, 15000.00, 0);
