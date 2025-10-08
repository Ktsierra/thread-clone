import { httpAction } from "./_generated/server";
import { httpRouter } from "convex/server";
import { type UserJSON } from "@clerk/types";
import { internal } from "./_generated/api";

interface UserCreated {
  data: UserJSON;
  type: "user.created" | "user.udpdated";
}

const http = httpRouter();

export const handleClerkWebhook = httpAction(async (ctx, request) => {
  const { data, type } = (await request.json()) as UserCreated;

  switch (type) {
    case "user.created":
      await ctx.runMutation(internal.user.createUSer, {
        clerkId: data.id,
        email: data.email_addresses[0].email_address,
        first_name: data.first_name ?? "",
        last_name: data.last_name ?? "",
        imageUrl: data.image_url,
        username: data.username,
        followersCount: 0,
      });
      break;
    case "user.udpdated":
      console.log("user udpdated");
      break;
  }

  return new Response(null, { status: 200 });
});

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

// Endpoint: https://wonderful-bat-323.convex.site
export default http;
