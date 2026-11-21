-- CraftHub Minecraft Blog Database
-- Compatible with MySQL and MariaDB (XAMPP/phpMyAdmin)
-- Charset: utf8mb4

CREATE DATABASE IF NOT EXISTS `crafthub`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `crafthub`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `authors` (
  `author_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(100) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `bio` TEXT NULL,
  `avatar_path` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`author_id`),
  UNIQUE KEY `uq_authors_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(100) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tags` (
  `tag_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`tag_id`),
  UNIQUE KEY `uq_tags_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `articles` (
  `article_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `article_slug` VARCHAR(150) NOT NULL,
  `author_id` INT UNSIGNED NOT NULL,
  `category_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) NULL,
  `excerpt` TEXT NULL,
  `content` LONGTEXT NULL,
  `cover_image` VARCHAR(255) NULL,
  `author_avatar` VARCHAR(255) NULL,
  `difficulty` ENUM('Beginner','Intermediate','Advanced') NOT NULL DEFAULT 'Beginner',
  `reading_minutes` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  `accent_color` VARCHAR(20) NULL,
  `featured` BOOLEAN NOT NULL DEFAULT FALSE,
  `status` ENUM('Draft','Published') NOT NULL DEFAULT 'Draft',
  `hidden` BOOLEAN NOT NULL DEFAULT FALSE,
  `published_at` DATETIME NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`article_id`),
  UNIQUE KEY `uq_articles_slug` (`article_slug`),
  KEY `idx_articles_author` (`author_id`),
  KEY `idx_articles_category` (`category_id`),
  KEY `idx_articles_status_featured` (`status`,`featured`),
  CONSTRAINT `fk_articles_author` FOREIGN KEY (`author_id`) REFERENCES `authors` (`author_id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_articles_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `article_tags` (
  `article_id` INT UNSIGNED NOT NULL,
  `tag_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`article_id`,`tag_id`),
  KEY `idx_article_tags_tag` (`tag_id`),
  CONSTRAINT `fk_article_tags_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`article_id`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_article_tags_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `media_assets` (
  `media_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `source_path` VARCHAR(255) NOT NULL,
  `alt_text` VARCHAR(255) NULL,
  `added_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`media_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `article_media` (
  `article_id` INT UNSIGNED NOT NULL,
  `media_id` INT UNSIGNED NOT NULL,
  `usage_type` VARCHAR(50) NOT NULL DEFAULT 'content',
  PRIMARY KEY (`article_id`,`media_id`,`usage_type`),
  KEY `idx_article_media_media` (`media_id`),
  CONSTRAINT `fk_article_media_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`article_id`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_article_media_media` FOREIGN KEY (`media_id`) REFERENCES `media_assets` (`media_id`) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pages` (
  `page_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(100) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `route` VARCHAR(255) NOT NULL,
  `purpose` VARCHAR(255) NULL,
  `change_frequency` ENUM('always','hourly','daily','weekly','monthly','yearly','never') NULL,
  `priority` DECIMAL(2,1) NULL,
  `published_at` DATETIME NULL,
  PRIMARY KEY (`page_id`),
  UNIQUE KEY `uq_pages_slug` (`slug`),
  UNIQUE KEY `uq_pages_route` (`route`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `rss_feed_items` (
  `feed_item_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `article_id` INT UNSIGNED NULL,
  `title` VARCHAR(255) NOT NULL,
  `link` VARCHAR(255) NOT NULL,
  `guid` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `published_at` DATETIME NULL,
  PRIMARY KEY (`feed_item_id`),
  UNIQUE KEY `uq_rss_guid` (`guid`),
  KEY `idx_rss_article` (`article_id`),
  CONSTRAINT `fk_rss_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`article_id`) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `article_drafts` (
  `draft_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `article_id` INT UNSIGNED NULL,
  `author_id` INT UNSIGNED NULL,
  `category_id` INT UNSIGNED NULL,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) NULL,
  `excerpt` TEXT NULL,
  `content` LONGTEXT NULL,
  `tags_text` TEXT NULL,
  `cover_image` VARCHAR(255) NULL,
  `featured` BOOLEAN NOT NULL DEFAULT FALSE,
  `status` ENUM('Draft','Published') NOT NULL DEFAULT 'Draft',
  `saved_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`draft_id`),
  KEY `idx_drafts_article` (`article_id`),
  CONSTRAINT `fk_drafts_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`article_id`) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_drafts_author` FOREIGN KEY (`author_id`) REFERENCES `authors` (`author_id`) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_drafts_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `saved_articles` (
  `saved_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `article_id` INT UNSIGNED NOT NULL,
  `device_token` VARCHAR(100) NULL,
  `saved_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`saved_id`),
  UNIQUE KEY `uq_saved_article_device` (`article_id`,`device_token`),
  CONSTRAINT `fk_saved_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`article_id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `checklist_progress` (
  `progress_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `article_id` INT UNSIGNED NOT NULL,
  `checklist_key` VARCHAR(255) NOT NULL,
  `item_index` SMALLINT UNSIGNED NOT NULL,
  `is_complete` BOOLEAN NOT NULL DEFAULT FALSE,
  `device_token` VARCHAR(100) NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`progress_id`),
  UNIQUE KEY `uq_checklist_item` (`article_id`,`checklist_key`,`item_index`,`device_token`),
  CONSTRAINT `fk_checklist_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`article_id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `article_comments` (
  `comment_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `article_id` INT UNSIGNED NOT NULL,
  `display_name` VARCHAR(40) NOT NULL,
  `comment_text` VARCHAR(500) NOT NULL,
  `device_token` VARCHAR(100) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `idx_comments_article` (`article_id`,`created_at`),
  CONSTRAINT `fk_comments_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`article_id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `article_views` (
  `view_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `article_id` INT UNSIGNED NOT NULL,
  `device_token` VARCHAR(100) NULL,
  `view_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`view_id`),
  UNIQUE KEY `uq_article_views_device` (`article_id`,`device_token`),
  CONSTRAINT `fk_views_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`article_id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `article_feedback` (
  `feedback_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `article_id` INT UNSIGNED NOT NULL,
  `device_token` VARCHAR(100) NULL,
  `is_helpful` BOOLEAN NOT NULL,
  `submitted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`feedback_id`),
  UNIQUE KEY `uq_feedback_article_device` (`article_id`,`device_token`),
  CONSTRAINT `fk_feedback_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`article_id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `newsletter_signups` (
  `signup_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `device_token` VARCHAR(100) NULL,
  `signup_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`signup_id`),
  UNIQUE KEY `uq_newsletter_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `admin_activity` (
  `activity_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `article_id` INT UNSIGNED NULL,
  `action` VARCHAR(100) NOT NULL,
  `summary` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`activity_id`),
  KEY `idx_activity_created` (`created_at`),
  CONSTRAINT `fk_activity_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`article_id`) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- Seed authors
INSERT INTO `authors` (`slug`,`name`,`bio`) VALUES
('anthony-combalicer','Anthony Combalicer','Writes practical guides to early survival, exploration, and travel.'),
('joezyl-guillermo','Joezyl Guillermo','Writes about planning useful bases, workshops, and building details.'),
('jonas-astoveza','Jonas Astoveza','Writes beginner-friendly farming and resource guides.'),
('wenzel-cruz','Wenzel Cruz','Writes about safer exploration and practical survival routines.')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`),`bio`=VALUES(`bio`);

-- Seed categories
INSERT INTO `categories` (`slug`,`name`,`description`) VALUES
('survival','Survival','Starting tips, supplies, and ways to stay safe in a new world.'),
('building','Building','Plan a useful base and find ideas for your next build.'),
('farming','Farming','Learn beginner-friendly farm projects and resource collection.'),
('mining','Mining','Guides for caves, ores, mining trips, and underground exploration.')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`),`description`=VALUES(`description`);

-- Seed articles
INSERT INTO `articles`
(`article_slug`,`author_id`,`category_id`,`title`,`excerpt`,`cover_image`,`difficulty`,`reading_minutes`,`accent_color`,`featured`,`status`,`published_at`)
VALUES
('article-first-night',(SELECT author_id FROM authors WHERE slug='anthony-combalicer'),(SELECT category_id FROM categories WHERE slug='survival'),'5 Essential Tips to Survive Your First Night in Minecraft','Starting a new world is exciting, but the first night can be brutal. Gather wood, tools, food, shelter, and light.','assets/images/survivenight_skeleton.avif','Beginner',1,'#c63b2d',FALSE,'Published','2026-07-20 00:00:00'),
('article-survival-base',(SELECT author_id FROM authors WHERE slug='joezyl-guillermo'),(SELECT category_id FROM categories WHERE slug='building'),'The Ultimate Minecraft Survival Guide: From Dirt Shack to Mega Base','Plan your base around safety, storage, and future growth while keeping your early setup efficient.','assets/images/optimized/noobtomega.jpg','Intermediate',1,'#c63b2d',TRUE,'Published','2026-07-20 00:00:00'),
('article-auto-farms',(SELECT author_id FROM authors WHERE slug='jonas-astoveza'),(SELECT category_id FROM categories WHERE slug='farming'),'Essential Minecraft Auto Farms: 3 Beginner Projects','Set up useful auto farms for crops and resources.','assets/images/farm.png','Beginner',5,'#c63b2d',TRUE,'Published','2026-07-26 00:00:00'),
('article-iron-tools',(SELECT author_id FROM authors WHERE slug='anthony-combalicer'),(SELECT category_id FROM categories WHERE slug='survival'),'A Beginner''s Guide to Finding and Using Iron','Iron is one of the biggest upgrades in the early game.','assets/images/stonetools.png','Beginner',2,'#c63b2d',FALSE,'Published','2026-10-15 00:00:00'),
('article-caving-safely',(SELECT author_id FROM authors WHERE slug='wenzel-cruz'),(SELECT category_id FROM categories WHERE slug='survival'),'How to Explore Caves More Safely','Explore caves with a simple supply plan, route markers, and a safe return strategy.','assets/images/stone.png','Intermediate',2,'#c63b2d',FALSE,'Published','2026-10-15 00:00:00'),
('article-food-storage',(SELECT author_id FROM authors WHERE slug='jonas-astoveza'),(SELECT category_id FROM categories WHERE slug='farming'),'Reliable Food for a Long Minecraft Journey','Create a dependable food routine with crops, cooked meals, and a compact travel reserve.','assets/images/food.png','Beginner',2,'#c63b2d',FALSE,'Published','2026-10-15 00:00:00'),
('article-enchanting-setup',(SELECT author_id FROM authors WHERE slug='joezyl-guillermo'),(SELECT category_id FROM categories WHERE slug='building'),'Build a Practical Enchanting Corner','Design a compact enchanting corner with room for bookshelves, lapis, and prepared gear.','assets/images/house.png','Intermediate',2,'#c63b2d',FALSE,'Published','2026-10-15 00:00:00'),
('article-nether-preparation',(SELECT author_id FROM authors WHERE slug='anthony-combalicer'),(SELECT category_id FROM categories WHERE slug='survival'),'Prepare for Your First Nether Trip','Prepare equipment, supplies, and a return plan before your first Nether expedition.','assets/images/light.png','Intermediate',2,'#c63b2d',FALSE,'Published','2026-10-15 00:00:00'),
('article-village-trading',(SELECT author_id FROM authors WHERE slug='wenzel-cruz'),(SELECT category_id FROM categories WHERE slug='survival'),'Set Up a Safe Village Trading Route','Make village visits safer and more useful with lighting and a simple trading plan.','assets/images/farm2.png','Intermediate',2,'#c63b2d',FALSE,'Published','2026-10-15 00:00:00'),
('article-lighting-builds',(SELECT author_id FROM authors WHERE slug='joezyl-guillermo'),(SELECT category_id FROM categories WHERE slug='building'),'Light a Build Without Losing Its Atmosphere','Layer practical and decorative lighting to make builds safer and more welcoming.','assets/images/light.png','Beginner',2,'#c63b2d',FALSE,'Published','2026-10-15 00:00:00'),
('article-compost-farm',(SELECT author_id FROM authors WHERE slug='jonas-astoveza'),(SELECT category_id FROM categories WHERE slug='farming'),'Turn Spare Crops into Useful Bone Meal','Put spare plant items to work with a compact composter station beside a crop farm.','assets/images/farm.png','Beginner',2,'#c63b2d',FALSE,'Published','2026-10-15 00:00:00'),
('article-organized-storage',(SELECT author_id FROM authors WHERE slug='joezyl-guillermo'),(SELECT category_id FROM categories WHERE slug='building'),'Organize Storage That Can Grow with Your Base','Organize base storage with clear categories, labels, and room to expand.','assets/images/house.png','Beginner',2,'#c63b2d',FALSE,'Published','2026-10-15 00:00:00'),
('article-early-game-transport',(SELECT author_id FROM authors WHERE slug='anthony-combalicer'),(SELECT category_id FROM categories WHERE slug='building'),'Build Paths and Bridges for Easier Travel','Connect a base, farms, and nearby landmarks with safe paths and simple bridges.','assets/images/biome.png','Intermediate',2,'#c63b2d',FALSE,'Published','2026-10-15 00:00:00')
ON DUPLICATE KEY UPDATE
  `author_id`=VALUES(`author_id`),
  `category_id`=VALUES(`category_id`),
  `title`=VALUES(`title`),
  `excerpt`=VALUES(`excerpt`),
  `status`=VALUES(`status`);

-- Seed tags
INSERT IGNORE INTO `tags` (`name`) VALUES
('survival'),('beginner'),('starter'),('building'),('base'),('farming'),('redstone'),
('automation'),('mining'),('iron'),('caving'),('caves'),('safety'),('food'),('crops'),
('cooking'),('enchanting'),('bookshelves'),('nether'),('portal'),('village'),('trading'),
('villagers'),('lighting'),('creative'),('compost'),('bonemeal'),('storage'),('organization'),
('chests'),('transport'),('paths'),('bridges'),('travel');

-- Seed article-tag relationships
INSERT IGNORE INTO `article_tags` (`article_id`,`tag_id`)
SELECT a.article_id,t.tag_id FROM articles a JOIN tags t
WHERE (a.article_slug='article-first-night' AND t.name IN ('survival','beginner','starter'))
   OR (a.article_slug='article-survival-base' AND t.name IN ('survival','building','base'))
   OR (a.article_slug='article-auto-farms' AND t.name IN ('survival','farming','redstone','automation','beginner'))
   OR (a.article_slug='article-iron-tools' AND t.name IN ('survival','mining','iron','beginner'))
   OR (a.article_slug='article-caving-safely' AND t.name IN ('survival','mining','caves','caving','safety'))
   OR (a.article_slug='article-food-storage' AND t.name IN ('survival','food','farming','crops','cooking'))
   OR (a.article_slug='article-enchanting-setup' AND t.name IN ('building','enchanting','bookshelves','survival'))
   OR (a.article_slug='article-nether-preparation' AND t.name IN ('survival','nether','portal','mining'))
   OR (a.article_slug='article-village-trading' AND t.name IN ('survival','village','trading','villagers','safety'))
   OR (a.article_slug='article-lighting-builds' AND t.name IN ('building','lighting','creative','survival'))
   OR (a.article_slug='article-compost-farm' AND t.name IN ('farming','compost','crops','bonemeal','survival'))
   OR (a.article_slug='article-organized-storage' AND t.name IN ('building','storage','organization','chests','base'))
   OR (a.article_slug='article-early-game-transport' AND t.name IN ('building','transport','paths','bridges','survival','travel'));

-- Seed media library entries used by the site
INSERT IGNORE INTO `media_assets` (`name`,`source_path`,`alt_text`) VALUES
('First night','assets/images/survivenight_skeleton.avif','Minecraft first-night survival scene'),
('Main image','assets/images/optimized/main.jpg','CraftHub featured guide image'),
('Survival base','assets/images/optimized/noobtomega.jpg','Minecraft survival base'),
('Farm','assets/images/farm.png','Minecraft farming scene'),
('Food','assets/images/food.png','Minecraft food resources'),
('Stone tools','assets/images/stonetools.png','Minecraft stone tools'),
('House','assets/images/house.png','Minecraft house build'),
('Biome','assets/images/biome.png','Minecraft biome'),
('Lighting','assets/images/light.png','Minecraft lighting');

-- Seed website pages
INSERT INTO `pages` (`slug`,`name`,`route`,`purpose`,`change_frequency`,`priority`) VALUES
('home','Home','index.html','Homepage and featured article listings','daily',1.0),
('categories','Categories','pages/categories.html','Browse articles by category','weekly',0.8),
('authors','Authors','pages/authors.html','Browse articles by author','monthly',0.7),
('about','About','pages/about.html','Information about CraftHub','monthly',0.6),
('tools','Tools','pages/tools.html','Minecraft tools and utilities','monthly',0.7),
('author-studio','Author Studio','author-studio.html','Create and manage author drafts','monthly',0.6),
('admin','Admin Dashboard','admin.html','Manage articles, media, and site settings','monthly',0.6)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`),`purpose`=VALUES(`purpose`),`change_frequency`=VALUES(`change_frequency`),`priority`=VALUES(`priority`);

-- Seed the RSS item present in feed.xml
INSERT INTO `rss_feed_items` (`article_id`,`title`,`link`,`guid`,`description`,`published_at`)
SELECT a.article_id,a.title,'https://example.com/articles/article-first-night.html','https://example.com/articles/article-first-night.html',
'Beginner survival tips for your first night in Minecraft.','2026-07-20 00:00:00'
FROM `articles` a WHERE a.article_slug='article-first-night'
ON DUPLICATE KEY UPDATE
  `title`=VALUES(`title`),
  `link`=VALUES(`link`),
  `description`=VALUES(`description`);
