-- Create post_comments table for HuLife hobby app
-- Run this SQL script directly in your MySQL database if the TypeScript migration fails

USE hobby_app;

CREATE TABLE IF NOT EXISTS post_comments (
  id VARCHAR(255) PRIMARY KEY,
  post_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_image VARCHAR(255),
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Foreign keys
  CONSTRAINT fk_post_comments_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_post_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  -- Indexes for better query performance
  INDEX idx_post_id (post_id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verify table creation
SHOW TABLES LIKE 'post_comments';

-- Show table structure
DESCRIBE post_comments;
