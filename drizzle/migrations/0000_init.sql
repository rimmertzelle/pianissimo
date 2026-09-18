CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `task_tags` (
	`taskId` integer NOT NULL,
	`tagId` integer NOT NULL,
	PRIMARY KEY(`taskId`, `tagId`),
	FOREIGN KEY (`taskId`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tagId`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`priority` integer NOT NULL,
	`status` integer NOT NULL,
	`progress` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`completed_at` integer,
	`project_id` integer,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE set null
);
