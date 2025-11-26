import { mutation, query, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./user";
import { paginationOptsValidator, type PaginationResult } from "convex/server";
import { type Id, type Doc } from "./_generated/dataModel";

export const addThreadMessage = mutation({
  args: {
    content: v.string(),
    mediaFiles: v.optional(v.array(v.string())),
    websiteUrl: v.optional(v.string()),
    threadId: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    if (args.threadId) {
      const originalThread = await ctx.db.get(args.threadId);

      await ctx.db.patch(args.threadId, {
        commentCount: (originalThread?.commentCount ?? 0) + 1,
      });
    }

    return await ctx.db.insert("messages", {
      ...args,
      userId: user._id,
      likeCount: 0,
      commentCount: 0,
      retweetCount: 0,
    });
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    await getCurrentUserOrThrow(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const getThreads = query({
  args: {
    paginationOpts: paginationOptsValidator,
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    let threads: PaginationResult<Doc<"messages">>;

    if (args.userId) {
      threads = await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .order("desc")
        .paginate(args.paginationOpts);
    } else {
      threads = await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("threadId"), undefined))
        .order("desc")
        .paginate(args.paginationOpts);
    }

    const messagesWithCreator = await Promise.all(
      threads.page.map(async (thread) => {
        const creator = await getMessageCreator(ctx, thread.userId);
        const mediaUrls = await getMediaUrls(ctx, thread.mediaFiles);

        return {
          ...thread,
          creator,
          mediaFiles: mediaUrls,
        };
      }),
    );
    return {
      ...threads,
      page: messagesWithCreator,
    };
  },
});

const getMessageCreator = async (ctx: QueryCtx, userId: Id<"users">) => {
  const user = await ctx.db.get(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.imageUrl || user.imageUrl.startsWith("http")) {
    return user;
  }

  const image = await ctx.storage.getUrl(user.imageUrl as Id<"_storage">);
  const imageUrl = image ?? undefined;
  return { ...user, imageUrl };
};

const getMediaUrls = async (
  ctx: QueryCtx,
  mediaFiles: string[] | undefined,
) => {
  if (!mediaFiles || mediaFiles.length === 0) return [];

  return await Promise.all(
    mediaFiles.map(async (file) => {
      if (!file.startsWith("http")) {
        const url = await ctx.storage.getUrl(file as Id<"_storage">);
        return String(url);
      } else return file;
    }),
  );
};

export const likeThread = mutation({
  args: {
    threadId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const message = await ctx.db.get(args.threadId);

    if (!message) throw new Error("Message not found");

    if (message.userLikes?.includes(user._id)) {
      await ctx.db.patch(args.threadId, {
        likeCount: message.likeCount - 1,
        userLikes: message.userLikes.filter((id) => id !== user._id),
      });
    }
    await ctx.db.patch(args.threadId, {
      likeCount: message.likeCount + 1,
      userLikes: [...(message.userLikes ?? []), user._id],
    });
  },
});

export const getThreadById = query({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.messageId);
    if (!thread) return null;
    const creator = await getMessageCreator(ctx, thread.userId);
    const mediaFiles = await getMediaUrls(ctx, thread.mediaFiles);

    return { ...thread, mediaFiles, creator };
  },
});

export const getComments = query({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("threadId"), args.messageId))
      .order("desc")
      .collect();

    const messagesWithCreator = await Promise.all(
      comments.map(async (comment) => {
        const creator = await getMessageCreator(ctx, comment.userId);
        const mediaUrls = await getMediaUrls(ctx, comment.mediaFiles);

        return {
          ...comment,
          creator,
          mediaFiles: mediaUrls,
        };
      }),
    );

    return messagesWithCreator;
  },
});
