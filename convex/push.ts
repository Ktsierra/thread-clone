import { v } from "convex/values";
import { internalAction } from "./_generated/server";

// Minimal, conservative types for the Expo Push API response:
interface ExpoPushTicket {
  status: "ok" | "error";
  id?: string;
  message?: string;
  details?: Record<string, unknown>;
}

interface ExpoPushResponse {
  // when sending a single notification you may get a single ticket or an object with data
  data?: ExpoPushTicket | ExpoPushTicket[];
  // explicit errors array if the API returns errors
  errors?: {
    status?: string;
    message?: string;
    details?: Record<string, unknown>;
  }[];
  // allow other fields without using `any`
  [key: string]: unknown;
}

const EXPO_ACCESS_TOKEN = process.env.EXPO_ACCESS_TOKEN;
console.log(EXPO_ACCESS_TOKEN);

export const sendPushNotification = internalAction({
  args: {
    pushToken: v.string(),
    messageTitle: v.string(),
    messageBody: v.string(),
    threadId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    console.log("args:", args);

    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${EXPO_ACCESS_TOKEN ?? ""}`,
      },
      body: JSON.stringify({
        to: args.pushToken,
        sound: "default",
        title: args.messageTitle,
        body: args.messageBody,
        data: {
          threadId: args.threadId,
        },
      }),
    });

    // cast the parsed JSON into ExplorerPushResponse to avoid `any`
    const notif = (await res.json()) as ExpoPushResponse;
    console.log(":", notif);
    return notif;
  },
});
