import { relations, sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";

// Users Table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  location: text("location").notNull(),
  phone: text("phone"),
  profileImage: text("profile_image"), // SQLite TEXT는 최대 1GB+ 저장 가능하므로 별도 타입 불필요
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// Hobbies Table
export const hobbies = sqliteTable("hobbies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  difficulty: integer("difficulty").notNull(),
  indoorOutdoor: text("indoor_outdoor").notNull(), // enum 대신 text 사용
  socialIndividual: text("social_individual").notNull(),
  budget: text("budget").notNull(),
  imageUrl: text("image_url").notNull(),
  videoUrl: text("video_url"),
  benefits: text("benefits", { mode: "json" }).$type<string[]>().notNull(), // JSON 모드 사용
  requirements: text("requirements", { mode: "json" }).$type<string[]>().notNull(),
});

// Survey Responses
export const surveyResponses = sqliteTable("survey_responses", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  responses: text("responses", { mode: "json" }).$type<{ [key: string]: number | string }>().notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// Reviews
export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  userName: text("user_name").notNull(),
  hobbyId: text("hobby_id").notNull().references(() => hobbies.id),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// Communities
export const communities = sqliteTable("communities", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  hobbyId: text("hobby_id").notNull().references(() => hobbies.id),
  hobbyName: text("hobby_name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  schedule: text("schedule").notNull(),
  memberCount: integer("member_count").notNull().default(1),
  maxMembers: integer("max_members").notNull(),
  imageUrl: text("image_url").notNull(),
  leaderId: text("leader_id").notNull().references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// Posts
export const posts = sqliteTable("posts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  userName: text("user_name").notNull(),
  userImage: text("user_image"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  images: text("images", { mode: "json" }), // JSON 배열로 저장
  likes: integer("likes").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  views: integer("views").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// User Hobbies
export const userHobbies = sqliteTable("user_hobbies", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  hobbyId: text("hobby_id").notNull().references(() => hobbies.id),
  hobbyName: text("hobby_name").notNull(),
  hobbyCategory: text("hobby_category").notNull(),
  hobbyDescription: text("hobby_description").notNull(),
  hobbyImage: text("hobby_image").notNull(),
  status: text("status").notNull(), // enum 대신 text
  progress: integer("progress").notNull().default(0),
  startedAt: integer("started_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  completedAt: integer("completed_at", { mode: "timestamp" }),
});

// Schedules
export const schedules = sqliteTable("schedules", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  hobbyId: text("hobby_id").references(() => hobbies.id),
  date: integer("date", { mode: "timestamp" }).notNull(),
  time: text("time").notNull(),
  location: text("location"),
  type: text("type").notNull(),
});

// Post Likes
export const postLikes = sqliteTable("post_likes", {
  id: text("id").primaryKey(),
  postId: text("post_id").notNull().references(() => posts.id),
  userId: text("user_id").notNull().references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// Community Members
export const communityMembers = sqliteTable("community_members", {
  id: text("id").primaryKey(),
  communityId: text("community_id").notNull().references(() => communities.id),
  userId: text("user_id").notNull().references(() => users.id),
  joinedAt: integer("joined_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  role: text("role").notNull(),
});

// Join Requests
export const joinRequests = sqliteTable("join_requests", {
  id: text("id").primaryKey(),
  communityId: text("community_id").notNull().references(() => communities.id),
  userId: text("user_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  respondedAt: integer("responded_at", { mode: "timestamp" }),
});

// Chat Rooms
export const chatRooms = sqliteTable("chat_rooms", {
  id: text("id").primaryKey(),
  communityId: text("community_id").notNull().unique().references(() => communities.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// Chat Messages
export const chatMessages = sqliteTable("chat_messages", {
  id: text("id").primaryKey(),
  chatRoomId: text("chat_room_id").notNull().references(() => chatRooms.id),
  userId: text("user_id").notNull().references(() => users.id),
  userName: text("user_name").notNull(),
  userImage: text("user_image"),
  message: text("message").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// Post Comments
export const postComments = sqliteTable("post_comments", {
  id: text("id").primaryKey(),
  postId: text("post_id").notNull().references(() => posts.id),
  userId: text("user_id").notNull().references(() => users.id),
  userName: text("user_name").notNull(),
  userImage: text("user_image"),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// Gallery Items
export const galleryItems = sqliteTable("gallery_items", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  userName: text("user_name").notNull(),
  userImage: text("user_image"),
  hobbyId: text("hobby_id").notNull().references(() => hobbies.id),
  hobbyName: text("hobby_name").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  image: text("image"),
  videoUrl: text("video_url"),
  videoThumbnail: text("video_thumbnail"),
  likes: integer("likes").notNull().default(0),
  views: integer("views").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// Gallery Likes
export const galleryLikes = sqliteTable("gallery_likes", {
  id: text("id").primaryKey(),
  galleryItemId: text("gallery_item_id").notNull().references(() => galleryItems.id),
  userId: text("user_id").notNull().references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// Gallery Comments
export const galleryComments = sqliteTable("gallery_comments", {
  id: text("id").primaryKey(),
  galleryItemId: text("gallery_item_id").notNull().references(() => galleryItems.id),
  userId: text("user_id").notNull().references(() => users.id),
  userName: text("user_name").notNull(),
  userImage: text("user_image"),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// User Activities
export const userActivities = sqliteTable("user_activities", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  activityType: text("activity_type").notNull(),
  targetId: text("target_id"),
  metadata: text("metadata", { mode: "json" }).$type<{
    searchQuery?: string;
    duration?: number;
    scrollDepth?: number;
    [key: string]: any;
  }>(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});


// --- RELATIONS (변경 없음) ---
// Relations 코드는 그대로 두셔도 되지만, 편의를 위해 여기에 포함합니다.
// (테이블 참조 변수가 위에서 정의한 sqliteTable로 자동으로 연결됩니다)

export const usersRelations = relations(users, ({ one, many }) => ({
  surveyResponse: one(surveyResponses, {
    fields: [users.id],
    references: [surveyResponses.userId],
  }),
  reviews: many(reviews),
  communities: many(communityMembers),
  posts: many(posts),
  userHobbies: many(userHobbies),
  schedules: many(schedules),
  activities: many(userActivities),
}));

export const hobbiesRelations = relations(hobbies, ({ many }) => ({
  reviews: many(reviews),
  communities: many(communities),
  userHobbies: many(userHobbies),
}));

export const surveyResponsesRelations = relations(surveyResponses, ({ one }) => ({
  user: one(users, {
    fields: [surveyResponses.userId],
    references: [users.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  hobby: one(hobbies, {
    fields: [reviews.hobbyId],
    references: [hobbies.id],
  }),
}));

export const communitiesRelations = relations(communities, ({ one, many }) => ({
  hobby: one(hobbies, {
    fields: [communities.hobbyId],
    references: [hobbies.id],
  }),
  leader: one(users, {
    fields: [communities.leaderId],
    references: [users.id],
  }),
  members: many(communityMembers),
}));

export const communityMembersRelations = relations(communityMembers, ({ one }) => ({
  community: one(communities, {
    fields: [communityMembers.communityId],
    references: [communities.id],
  }),
  user: one(users, {
    fields: [communityMembers.userId],
    references: [users.id],
  }),
}));

export const joinRequestsRelations = relations(joinRequests, ({ one }) => ({
  community: one(communities, {
    fields: [joinRequests.communityId],
    references: [communities.id],
  }),
  user: one(users, {
    fields: [joinRequests.userId],
    references: [users.id],
  }),
}));

export const chatRoomsRelations = relations(chatRooms, ({ one, many }) => ({
  community: one(communities, {
    fields: [chatRooms.communityId],
    references: [communities.id],
  }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  chatRoom: one(chatRooms, {
    fields: [chatMessages.chatRoomId],
    references: [chatRooms.id],
  }),
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(postComments),
}));

export const postCommentsRelations = relations(postComments, ({ one }) => ({
  post: one(posts, {
    fields: [postComments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postComments.userId],
    references: [users.id],
  }),
}));

export const userHobbiesRelations = relations(userHobbies, ({ one }) => ({
  user: one(users, {
    fields: [userHobbies.userId],
    references: [users.id],
  }),
  hobby: one(hobbies, {
    fields: [userHobbies.hobbyId],
    references: [hobbies.id],
  }),
}));

export const schedulesRelations = relations(schedules, ({ one }) => ({
  user: one(users, {
    fields: [schedules.userId],
    references: [users.id],
  }),
  hobby: one(hobbies, {
    fields: [schedules.hobbyId],
    references: [hobbies.id],
  }),
}));

export const userActivitiesRelations = relations(userActivities, ({ one }) => ({
  user: one(users, {
    fields: [userActivities.userId],
    references: [users.id],
  }),
}));