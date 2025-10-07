CREATE TABLE `communities` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`hobby_id` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`location` varchar(255) NOT NULL,
	`schedule` varchar(255) NOT NULL,
	`member_count` int NOT NULL DEFAULT 1,
	`max_members` int NOT NULL,
	`image_url` varchar(255) NOT NULL,
	`leader_id` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `communities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `community_members` (
	`id` varchar(255) NOT NULL,
	`community_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`joined_at` timestamp NOT NULL DEFAULT (now()),
	`role` enum('member','leader') NOT NULL,
	CONSTRAINT `community_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hobbies` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`difficulty` int NOT NULL,
	`indoor_outdoor` enum('indoor','outdoor','both') NOT NULL,
	`social_individual` enum('social','individual','both') NOT NULL,
	`budget` enum('low','medium','high') NOT NULL,
	`image_url` varchar(255) NOT NULL,
	`video_url` varchar(255),
	`benefits` json NOT NULL,
	`requirements` json NOT NULL,
	`curriculum` json,
	CONSTRAINT `hobbies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`user_name` varchar(255) NOT NULL,
	`user_image` varchar(255),
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`category` varchar(255) NOT NULL,
	`likes` int NOT NULL DEFAULT 0,
	`comments` int NOT NULL DEFAULT 0,
	`views` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`user_name` varchar(255) NOT NULL,
	`hobby_id` varchar(255) NOT NULL,
	`rating` int NOT NULL,
	`comment` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `survey_responses` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`responses` json NOT NULL,
	`completed_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `survey_responses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`age` int NOT NULL,
	`location` varchar(255) NOT NULL,
	`phone` varchar(255),
	`profile_image` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `communities` ADD CONSTRAINT `communities_hobby_id_hobbies_id_fk` FOREIGN KEY (`hobby_id`) REFERENCES `hobbies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `communities` ADD CONSTRAINT `communities_leader_id_users_id_fk` FOREIGN KEY (`leader_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `community_members` ADD CONSTRAINT `community_members_community_id_communities_id_fk` FOREIGN KEY (`community_id`) REFERENCES `communities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `community_members` ADD CONSTRAINT `community_members_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_hobby_id_hobbies_id_fk` FOREIGN KEY (`hobby_id`) REFERENCES `hobbies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `survey_responses` ADD CONSTRAINT `survey_responses_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;