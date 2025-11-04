import { relations } from "drizzle-orm/relations";
import { chatRooms, chatMessages, users, communities, hobbies, communityMembers, joinRequests, posts, postLikes, reviews, schedules, surveyResponses, userActivities, userHobbies } from "./schema";

export const chatMessagesRelations = relations(chatMessages, ({one}) => ({
	chatRoom: one(chatRooms, {
		fields: [chatMessages.chatRoomId],
		references: [chatRooms.id]
	}),
	user: one(users, {
		fields: [chatMessages.userId],
		references: [users.id]
	}),
}));

export const chatRoomsRelations = relations(chatRooms, ({one, many}) => ({
	chatMessages: many(chatMessages),
	community: one(communities, {
		fields: [chatRooms.communityId],
		references: [communities.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	chatMessages: many(chatMessages),
	communities: many(communities),
	communityMembers: many(communityMembers),
	joinRequests: many(joinRequests),
	postLikes: many(postLikes),
	posts: many(posts),
	reviews: many(reviews),
	schedules: many(schedules),
	surveyResponses: many(surveyResponses),
	userActivities: many(userActivities),
	userHobbies: many(userHobbies),
}));

export const communitiesRelations = relations(communities, ({one, many}) => ({
	chatRooms: many(chatRooms),
	hobby: one(hobbies, {
		fields: [communities.hobbyId],
		references: [hobbies.id]
	}),
	user: one(users, {
		fields: [communities.leaderId],
		references: [users.id]
	}),
	communityMembers: many(communityMembers),
	joinRequests: many(joinRequests),
}));

export const hobbiesRelations = relations(hobbies, ({many}) => ({
	communities: many(communities),
	reviews: many(reviews),
	schedules: many(schedules),
	userHobbies: many(userHobbies),
}));

export const communityMembersRelations = relations(communityMembers, ({one}) => ({
	community: one(communities, {
		fields: [communityMembers.communityId],
		references: [communities.id]
	}),
	user: one(users, {
		fields: [communityMembers.userId],
		references: [users.id]
	}),
}));

export const joinRequestsRelations = relations(joinRequests, ({one}) => ({
	community: one(communities, {
		fields: [joinRequests.communityId],
		references: [communities.id]
	}),
	user: one(users, {
		fields: [joinRequests.userId],
		references: [users.id]
	}),
}));

export const postLikesRelations = relations(postLikes, ({one}) => ({
	post: one(posts, {
		fields: [postLikes.postId],
		references: [posts.id]
	}),
	user: one(users, {
		fields: [postLikes.userId],
		references: [users.id]
	}),
}));

export const postsRelations = relations(posts, ({one, many}) => ({
	postLikes: many(postLikes),
	user: one(users, {
		fields: [posts.userId],
		references: [users.id]
	}),
}));

export const reviewsRelations = relations(reviews, ({one}) => ({
	hobby: one(hobbies, {
		fields: [reviews.hobbyId],
		references: [hobbies.id]
	}),
	user: one(users, {
		fields: [reviews.userId],
		references: [users.id]
	}),
}));

export const schedulesRelations = relations(schedules, ({one}) => ({
	hobby: one(hobbies, {
		fields: [schedules.hobbyId],
		references: [hobbies.id]
	}),
	user: one(users, {
		fields: [schedules.userId],
		references: [users.id]
	}),
}));

export const surveyResponsesRelations = relations(surveyResponses, ({one}) => ({
	user: one(users, {
		fields: [surveyResponses.userId],
		references: [users.id]
	}),
}));

export const userActivitiesRelations = relations(userActivities, ({one}) => ({
	user: one(users, {
		fields: [userActivities.userId],
		references: [users.id]
	}),
}));

export const userHobbiesRelations = relations(userHobbies, ({one}) => ({
	hobby: one(hobbies, {
		fields: [userHobbies.hobbyId],
		references: [hobbies.id]
	}),
	user: one(users, {
		fields: [userHobbies.userId],
		references: [users.id]
	}),
}));