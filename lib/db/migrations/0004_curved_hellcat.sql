CREATE TABLE `post_likes` (
	`id` varchar(255) NOT NULL,
	`post_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `post_likes` ADD CONSTRAINT `post_likes_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_likes` ADD CONSTRAINT `post_likes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;