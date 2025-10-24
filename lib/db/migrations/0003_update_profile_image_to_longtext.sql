-- Migration: Update profileImage column from TEXT to LONGTEXT
-- Reason: TEXT only supports up to 65KB, LONGTEXT supports up to 4GB
-- This allows storing large Base64 encoded images (used in profile and posts)
-- Date: 2025-10-24

ALTER TABLE `users`
MODIFY COLUMN `profile_image` LONGTEXT;
