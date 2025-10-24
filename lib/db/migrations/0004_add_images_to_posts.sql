-- Migration: Add images column to posts table
-- Reason: Allow users to upload multiple images in posts (stored as JSON array of Base64)
-- Date: 2025-10-24

ALTER TABLE `posts`
ADD COLUMN `images` LONGTEXT NULL;
