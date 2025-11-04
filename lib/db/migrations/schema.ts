import { mysqlTable, mysqlSchema, AnyMySqlColumn, foreignKey, primaryKey, varchar, text, timestamp, unique, int, mysqlEnum, json, index, longtext } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const chatMessages = mysqlTable("chat_messages", {
	id: varchar({ length: 255 }).notNull(),
	chatRoomId: varchar("chat_room_id", { length: 255 }).notNull().references(() => chatRooms.id),
	userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
	userName: varchar("user_name", { length: 255 }).notNull(),
	userImage: varchar("user_image", { length: 255 }),
	message: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "chat_messages_id"}),
]);

export const chatRooms = mysqlTable("chat_rooms", {
	id: varchar({ length: 255 }).notNull(),
	communityId: varchar("community_id", { length: 255 }).notNull().references(() => communities.id),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "chat_rooms_id"}),
	unique("chat_rooms_community_id_unique").on(table.communityId),
]);

export const communities = mysqlTable("communities", {
	id: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	hobbyId: varchar("hobby_id", { length: 255 }).notNull().references(() => hobbies.id),
	description: text().notNull(),
	location: varchar({ length: 255 }).notNull(),
	schedule: varchar({ length: 255 }).notNull(),
	memberCount: int("member_count").default(1).notNull(),
	maxMembers: int("max_members").notNull(),
	imageUrl: varchar("image_url", { length: 255 }).notNull(),
	leaderId: varchar("leader_id", { length: 255 }).notNull().references(() => users.id),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "communities_id"}),
]);

export const communityMembers = mysqlTable("community_members", {
	id: varchar({ length: 255 }).notNull(),
	communityId: varchar("community_id", { length: 255 }).notNull().references(() => communities.id),
	userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
	joinedAt: timestamp("joined_at", { mode: 'string' }).default(sql`(now())`).notNull(),
	role: mysqlEnum(['member','leader']).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "community_members_id"}),
]);

export const hobbies = mysqlTable("hobbies", {
	id: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	category: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	difficulty: int().notNull(),
	indoorOutdoor: mysqlEnum("indoor_outdoor", ['indoor','outdoor','both']).notNull(),
	socialIndividual: mysqlEnum("social_individual", ['social','individual','both']).notNull(),
	budget: mysqlEnum(['low','medium','high']).notNull(),
	imageUrl: varchar("image_url", { length: 255 }).notNull(),
	videoUrl: varchar("video_url", { length: 255 }),
	benefits: json().notNull(),
	requirements: json().notNull(),
	curriculum: json(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "hobbies_id"}),
]);

export const joinRequests = mysqlTable("join_requests", {
	id: varchar({ length: 255 }).notNull(),
	communityId: varchar("community_id", { length: 255 }).notNull().references(() => communities.id),
	userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
	status: mysqlEnum(['pending','approved','rejected']).default('pending').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`).notNull(),
	respondedAt: timestamp("responded_at", { mode: 'string' }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "join_requests_id"}),
]);

export const postComments = mysqlTable("post_comments", {
	id: varchar({ length: 255 }).notNull(),
	postId: varchar("post_id", { length: 255 }).notNull(),
	userId: varchar("user_id", { length: 255 }).notNull(),
	userName: varchar("user_name", { length: 255 }).notNull(),
	userImage: longtext("user_image"),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	index("idx_created_at").on(table.createdAt),
	index("idx_post_id").on(table.postId),
	index("idx_user_id").on(table.userId),
	primaryKey({ columns: [table.id], name: "post_comments_id"}),
]);

export const postLikes = mysqlTable("post_likes", {
	id: varchar({ length: 255 }).notNull(),
	postId: varchar("post_id", { length: 255 }).notNull().references(() => posts.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => [
	index("post_likes_post_id_idx").on(table.postId),
	index("post_likes_user_id_idx").on(table.userId),
	primaryKey({ columns: [table.id], name: "post_likes_id"}),
]);

export const posts = mysqlTable("posts", {
	id: varchar({ length: 255 }).notNull(),
	userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
	userName: varchar("user_name", { length: 255 }).notNull(),
	userImage: longtext("user_image"),
	title: varchar({ length: 255 }).notNull(),
	content: text().notNull(),
	category: varchar({ length: 255 }).notNull(),
	likes: int().default(0).notNull(),
	comments: int().default(0).notNull(),
	views: int().default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`).notNull(),
	images: longtext(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "posts_id"}),
]);

export const reviews = mysqlTable("reviews", {
	id: varchar({ length: 255 }).notNull(),
	userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
	userName: varchar("user_name", { length: 255 }).notNull(),
	hobbyId: varchar("hobby_id", { length: 255 }).notNull().references(() => hobbies.id),
	rating: int().notNull(),
	comment: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "reviews_id"}),
]);

export const schedules = mysqlTable("schedules", {
	id: varchar({ length: 255 }).notNull(),
	userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
	title: varchar({ length: 255 }).notNull(),
	hobbyId: varchar("hobby_id", { length: 255 }).references(() => hobbies.id),
	date: timestamp({ mode: 'string' }).notNull(),
	time: varchar({ length: 255 }).notNull(),
	location: varchar({ length: 255 }),
	type: mysqlEnum(['class','practice','meeting','event']).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "schedules_id"}),
]);

export const surveyResponses = mysqlTable("survey_responses", {
	id: varchar({ length: 255 }).notNull(),
	userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
	responses: json().notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "survey_responses_id"}),
]);

export const userActivities = mysqlTable("user_activities", {
	id: varchar({ length: 255 }).notNull(),
	userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
	activityType: mysqlEnum("activity_type", ['view_hobby','view_community','view_post','search','join_community','add_hobby_interest','remove_hobby_interest','complete_survey','create_post','create_schedule']).notNull(),
	targetId: varchar("target_id", { length: 255 }),
	metadata: json(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "user_activities_id"}),
]);

export const userHobbies = mysqlTable("user_hobbies", {
	id: varchar({ length: 255 }).notNull(),
	userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
	hobbyId: varchar("hobby_id", { length: 255 }).notNull().references(() => hobbies.id),
	status: mysqlEnum(['interested','learning','completed']).notNull(),
	progress: int().default(0).notNull(),
	startedAt: timestamp("started_at", { mode: 'string' }).default(sql`(now())`).notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "user_hobbies_id"}),
]);

export const users = mysqlTable("users", {
	id: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	age: int().notNull(),
	location: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 255 }),
	profileImage: longtext("profile_image"),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "users_id"}),
	unique("users_email_unique").on(table.email),
]);
