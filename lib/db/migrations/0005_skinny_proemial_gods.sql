CREATE TABLE `gallery_comments` (
	`id` varchar(255) NOT NULL,
	`gallery_item_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`user_name` varchar(255) NOT NULL,
	`user_image` longtext,
	`content` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gallery_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gallery_items` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`user_name` varchar(255) NOT NULL,
	`user_image` longtext,
	`hobby_id` varchar(255) NOT NULL,
	`hobby_name` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`image` longtext,
	`video_url` varchar(500),
	`video_thumbnail` longtext,
	`likes` int NOT NULL DEFAULT 0,
	`views` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gallery_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gallery_likes` (
	`id` varchar(255) NOT NULL,
	`gallery_item_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gallery_likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `chat_messages` MODIFY COLUMN `user_image` longtext;--> statement-breakpoint
ALTER TABLE `post_comments` MODIFY COLUMN `user_image` longtext;--> statement-breakpoint
ALTER TABLE `posts` MODIFY COLUMN `user_image` longtext;--> statement-breakpoint
ALTER TABLE `posts` MODIFY COLUMN `images` longtext;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `profile_image` longtext;--> statement-breakpoint
ALTER TABLE `communities` ADD `hobby_name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `user_hobbies` ADD `hobby_name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `user_hobbies` ADD `hobby_category` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `user_hobbies` ADD `hobby_description` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user_hobbies` ADD `hobby_image` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `gallery_comments` ADD CONSTRAINT `gallery_comments_gallery_item_id_gallery_items_id_fk` FOREIGN KEY (`gallery_item_id`) REFERENCES `gallery_items`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gallery_comments` ADD CONSTRAINT `gallery_comments_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gallery_items` ADD CONSTRAINT `gallery_items_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gallery_items` ADD CONSTRAINT `gallery_items_hobby_id_hobbies_id_fk` FOREIGN KEY (`hobby_id`) REFERENCES `hobbies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gallery_likes` ADD CONSTRAINT `gallery_likes_gallery_item_id_gallery_items_id_fk` FOREIGN KEY (`gallery_item_id`) REFERENCES `gallery_items`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gallery_likes` ADD CONSTRAINT `gallery_likes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `hobbies` DROP COLUMN `curriculum`;