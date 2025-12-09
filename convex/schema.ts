import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const User = {
  email: v.string(),
  clerkId: v.string(),
  imageUrl: v.optional(v.union(v.string(), v.id("_storage"))),
  first_name: v.optional(v.string()),
  last_name: v.optional(v.string()),
  username: v.union(v.string(), v.null()),
  bio: v.optional(v.string()),
  location: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
  followersCount: v.number(),
  pushToken: v.optional(v.string()),
};

export const Message = {
  userId: v.id("users"), // Foreign key to users table
  threadId: v.optional(v.id("messages")),
  userLikes: v.optional(v.array(v.id("users"))),
  content: v.string(),
  likeCount: v.number(), // Default value 0
  commentCount: v.number(), // Default value 0
  retweetCount: v.number(), // Default value 0
  mediaFiles: v.optional(v.array(v.string())), // Array of media file URLs
  websiteUrl: v.optional(v.string()), // Optional website URL
};

export default defineSchema({
  users: defineTable(User)
    .index("byClerkId", ["clerkId"])
    .searchIndex("searchUsers", {
      searchField: "username",
    }),
  messages: defineTable(Message),
});
