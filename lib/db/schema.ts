import { relations } from "drizzle-orm"
import {
  mysqlTable,
  varchar,
  text,
  int,
  timestamp,
  json,
  mysqlEnum,
  customType,
} from "drizzle-orm/mysql-core"

// Custom LONGTEXT type for large Base64 images (up to 4GB)
const longtext = customType<{ data: string; notNull: false; default: false }>({
  dataType() {
    return "longtext"
  },
})

export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  age: int("age").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }),
  profileImage: longtext("profile_image"), // ✅ LONGTEXT (최대 4GB, Base64 대용량 이미지 저장)
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const hobbies = mysqlTable("hobbies", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  description: text("description").notNull(),
  difficulty: int("difficulty").notNull(),
  indoorOutdoor: mysqlEnum("indoor_outdoor", ["indoor", "outdoor", "both"]).notNull(),
  socialIndividual: mysqlEnum("social_individual", ["social", "individual", "both"]).notNull(),
  budget: mysqlEnum("budget", ["low", "medium", "high"]).notNull(),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
  videoUrl: varchar("video_url", { length: 255 }),
  benefits: json("benefits").$type<string[]>().notNull(),
  requirements: json("requirements").$type<string[]>().notNull(),
})

export const surveyResponses = mysqlTable("survey_responses", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  responses: json("responses").$type<{ [key: string]: number | string }>().notNull(),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
})

export const reviews = mysqlTable("reviews", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  userName: varchar("user_name", { length: 255 }).notNull(),
  hobbyId: varchar("hobby_id", { length: 255 }).notNull().references(() => hobbies.id),
  rating: int("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const communities = mysqlTable("communities", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  hobbyId: varchar("hobby_id", { length: 255 }).notNull().references(() => hobbies.id),
  hobbyName: varchar("hobby_name", { length: 255 }).notNull(), // 비정규화: 취미 이름 직접 저장 (이미지 매핑용)
  description: text("description").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  schedule: varchar("schedule", { length: 255 }).notNull(),
  memberCount: int("member_count").notNull().default(1),
  maxMembers: int("max_members").notNull(),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
  leaderId: varchar("leader_id", { length: 255 }).notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const posts = mysqlTable("posts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  userName: varchar("user_name", { length: 255 }).notNull(),
  userImage: longtext("user_image"), // ✅ LONGTEXT: Base64 프로필 이미지 저장 (최대 4GB)
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  images: longtext("images"), // ✅ LONGTEXT: JSON 배열로 Base64 이미지 저장 (최대 4GB)
  likes: int("likes").notNull().default(0),
  comments: int("comments").notNull().default(0),
  views: int("views").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const userHobbies = mysqlTable("user_hobbies", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  hobbyId: varchar("hobby_id", { length: 255 }).notNull().references(() => hobbies.id),
  hobbyName: varchar("hobby_name", { length: 255 }).notNull(), // 비정규화: 취미 이름 직접 저장
  hobbyCategory: varchar("hobby_category", { length: 255 }).notNull(), // 비정규화: 카테고리 직접 저장
  hobbyDescription: text("hobby_description").notNull(), // 비정규화: 설명 직접 저장
  hobbyImage: varchar("hobby_image", { length: 255 }).notNull(), // 비정규화: 이미지 URL 직접 저장
  status: mysqlEnum("status", ["interested", "learning", "completed"]).notNull(),
  progress: int("progress").notNull().default(0),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
})

export const schedules = mysqlTable("schedules", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  hobbyId: varchar("hobby_id", { length: 255 }).references(() => hobbies.id),
  date: timestamp("date").notNull(),
  time: varchar("time", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  type: mysqlEnum("type", ["class", "practice", "meeting", "event"]).notNull(),
});

export const postLikes = mysqlTable("post_likes", {
  id: varchar("id", { length: 255 }).primaryKey(),
  postId: varchar("post_id", { length: 255 }).notNull().references(() => posts.id),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});


// --- RELATIONS ---

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
}))

export const hobbiesRelations = relations(hobbies, ({ many }) => ({
  reviews: many(reviews),
  communities: many(communities),
  userHobbies: many(userHobbies),
}))

export const surveyResponsesRelations = relations(surveyResponses, ({ one }) => ({
  user: one(users, {
    fields: [surveyResponses.userId],
    references: [users.id],
  }),
}))

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  hobby: one(hobbies, {
    fields: [reviews.hobbyId],
    references: [hobbies.id],
  }),
}))

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
}))

// Join table for community members
export const communityMembers = mysqlTable("community_members", {
  id: varchar("id", { length: 255 }).primaryKey(),
  communityId: varchar("community_id", { length: 255 }).notNull().references(() => communities.id),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  role: mysqlEnum("role", ["member", "leader"]).notNull(),
})

// Join requests table
export const joinRequests = mysqlTable("join_requests", {
  id: varchar("id", { length: 255 }).primaryKey(),
  communityId: varchar("community_id", { length: 255 }).notNull().references(() => communities.id),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  respondedAt: timestamp("responded_at"),
})

// Chat rooms table
export const chatRooms = mysqlTable("chat_rooms", {
  id: varchar("id", { length: 255 }).primaryKey(),
  communityId: varchar("community_id", { length: 255 }).notNull().unique().references(() => communities.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// Chat messages table
export const chatMessages = mysqlTable("chat_messages", {
  id: varchar("id", { length: 255 }).primaryKey(),
  chatRoomId: varchar("chat_room_id", { length: 255 }).notNull().references(() => chatRooms.id),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  userName: varchar("user_name", { length: 255 }).notNull(),
  userImage: longtext("user_image"), // Base64 profile image
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// Post comments table
export const postComments = mysqlTable("post_comments", {
  id: varchar("id", { length: 255 }).primaryKey(),
  postId: varchar("post_id", { length: 255 }).notNull().references(() => posts.id),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  userName: varchar("user_name", { length: 255 }).notNull(),
  userImage: longtext("user_image"), // Base64 profile image
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// Gallery table - User's hobby artworks (images and videos)
export const galleryItems = mysqlTable("gallery_items", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  userName: varchar("user_name", { length: 255 }).notNull(),
  userImage: longtext("user_image"), // Base64 profile image
  hobbyId: varchar("hobby_id", { length: 255 }).notNull().references(() => hobbies.id),
  hobbyName: varchar("hobby_name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  image: longtext("image"), // Base64 artwork image (nullable for videos)
  videoUrl: varchar("video_url", { length: 500 }), // Video URL (for video uploads)
  videoThumbnail: longtext("video_thumbnail"), // Base64 video thumbnail
  likes: int("likes").notNull().default(0),
  views: int("views").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// Gallery likes table
export const galleryLikes = mysqlTable("gallery_likes", {
  id: varchar("id", { length: 255 }).primaryKey(),
  galleryItemId: varchar("gallery_item_id", { length: 255 }).notNull().references(() => galleryItems.id),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// Gallery comments table
export const galleryComments = mysqlTable("gallery_comments", {
  id: varchar("id", { length: 255 }).primaryKey(),
  galleryItemId: varchar("gallery_item_id", { length: 255 }).notNull().references(() => galleryItems.id),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  userName: varchar("user_name", { length: 255 }).notNull(),
  userImage: longtext("user_image"), // Base64 profile image
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const communityMembersRelations = relations(communityMembers, ({ one }) => ({
  community: one(communities, {
    fields: [communityMembers.communityId],
    references: [communities.id],
  }),
  user: one(users, {
    fields: [communityMembers.userId],
    references: [users.id],
  }),
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(postComments),
}))

export const postCommentsRelations = relations(postComments, ({ one }) => ({
  post: one(posts, {
    fields: [postComments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postComments.userId],
    references: [users.id],
  }),
}))

export const userHobbiesRelations = relations(userHobbies, ({ one }) => ({
  user: one(users, {
    fields: [userHobbies.userId],
    references: [users.id],
  }),
  hobby: one(hobbies, {
    fields: [userHobbies.hobbyId],
    references: [hobbies.id],
  }),
}))

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

// User activity logs table for tracking user behavior and improving recommendations
export const userActivities = mysqlTable("user_activities", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  activityType: mysqlEnum("activity_type", [
    "view_hobby",
    "view_community",
    "view_post",
    "search",
    "join_community",
    "add_hobby_interest",
    "remove_hobby_interest",
    "complete_survey",
    "create_post",
    "create_schedule"
  ]).notNull(),
  targetId: varchar("target_id", { length: 255 }), // ID of the hobby/community/post being interacted with
  metadata: json("metadata").$type<{
    searchQuery?: string;
    duration?: number; // seconds spent on page
    scrollDepth?: number; // percentage scrolled
    [key: string]: any;
  }>(), // Additional contextual data
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

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

export const userActivitiesRelations = relations(userActivities, ({ one }) => ({
  user: one(users, {
    fields: [userActivities.userId],
    references: [users.id],
  }),
}));
