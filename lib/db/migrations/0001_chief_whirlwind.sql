CREATE TABLE `schedules` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`hobby_id` varchar(255),
	`date` timestamp NOT NULL,
	`time` varchar(255) NOT NULL,
	`location` varchar(255),
	`type` enum('class','practice','meeting','event') NOT NULL,
	CONSTRAINT `schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_hobbies` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`hobby_id` varchar(255) NOT NULL,
	`status` enum('interested','learning','completed') NOT NULL,
	`progress` int NOT NULL DEFAULT 0,
	`started_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	CONSTRAINT `user_hobbies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_hobby_id_hobbies_id_fk` FOREIGN KEY (`hobby_id`) REFERENCES `hobbies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_hobbies` ADD CONSTRAINT `user_hobbies_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_hobbies` ADD CONSTRAINT `user_hobbies_hobby_id_hobbies_id_fk` FOREIGN KEY (`hobby_id`) REFERENCES `hobbies`(`id`) ON DELETE no action ON UPDATE no action;