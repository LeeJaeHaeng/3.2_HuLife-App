-- Migration: Update profileImage column from VARCHAR(255) to TEXT
-- Reason: To support Base64 encoded images which are much longer than 255 characters
-- Date: 2025-10-24

ALTER TABLE `users`
MODIFY COLUMN `profile_image` TEXT;
