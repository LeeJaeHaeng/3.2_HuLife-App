CREATE TABLE `chat_messages` (
	`id` varchar(255) NOT NULL,
	`chat_room_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`user_name` varchar(255) NOT NULL,
	`user_image` varchar(255),
	`message` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_rooms` (
	`id` varchar(255) NOT NULL,
	`community_id` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_rooms_id` PRIMARY KEY(`id`),
	CONSTRAINT `chat_rooms_community_id_unique` UNIQUE(`community_id`)
);
--> statement-breakpoint
CREATE TABLE `join_requests` (
	`id` varchar(255) NOT NULL,
	`community_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`responded_at` timestamp,
	CONSTRAINT `join_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post_comments` (
	`id` varchar(255) NOT NULL,
	`post_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`user_name` varchar(255) NOT NULL,
	`user_image` varchar(255),
	`content` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_activities` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`activity_type` enum('view_hobby','view_community','view_post','search','join_community','add_hobby_interest','remove_hobby_interest','complete_survey','create_post','create_schedule') NOT NULL,
	`target_id` varchar(255),
	`metadata` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `profile_image` text;--> statement-breakpoint
ALTER TABLE `posts` ADD `images` text;--> statement-breakpoint
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_chat_room_id_chat_rooms_id_fk` FOREIGN KEY (`chat_room_id`) REFERENCES `chat_rooms`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chat_rooms` ADD CONSTRAINT `chat_rooms_community_id_communities_id_fk` FOREIGN KEY (`community_id`) REFERENCES `communities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `join_requests` ADD CONSTRAINT `join_requests_community_id_communities_id_fk` FOREIGN KEY (`community_id`) REFERENCES `communities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `join_requests` ADD CONSTRAINT `join_requests_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_comments` ADD CONSTRAINT `post_comments_post_id_posts_id_fk` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_comments` ADD CONSTRAINT `post_comments_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_activities` ADD CONSTRAINT `user_activities_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;